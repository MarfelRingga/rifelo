#!/bin/bash

# ==============================================================================
# Supabase Backup & Monitoring Script (Enhanced & Resilient)
# ==============================================================================
# Requirements: pg_dump, rclone, curl
# Usage: ./supabase_backup.sh
# ==============================================================================

# Safely load environment variables from .env if present
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
elif [ -f "$SCRIPT_DIR/../.env" ]; then
    set -a
    source "$SCRIPT_DIR/../.env"
    set +a
fi

# Path Configuration (Defaults to relative path if not set)
BACKUP_LOCAL_PATH=${BACKUP_LOCAL_PATH:-"./backups"}
RCLONE_REMOTE_NAME=${RCLONE_REMOTE_NAME:-"gdrive"}
RCLONE_DEST_PATH=${RCLONE_DEST_PATH:-"rifelo-backup"}

# Setup cleanup on exit
PG_ERR_LOG=$(mktemp)
trap 'rm -f "$PG_ERR_LOG"' EXIT

TIMESTAMP=$(date +"%y%m%d_%H%M%S")
BACKUP_NAME="supabase_backup_$TIMESTAMP.sql"
LOCAL_FILE="$BACKUP_LOCAL_PATH/$BACKUP_NAME"
LOG_ID=""

# Ensure local backup directory exists
mkdir -p "$BACKUP_LOCAL_PATH"

# JSON string escaping helper to prevent malformed JSON errors in Supabase PostgREST
escape_for_json() {
    local str="$1"
    # Truncate to reasonable length to avoid HTTP payload limits (max 2000 chars)
    if [ ${#str} -gt 2000 ]; then
        str="${str:0:1990}... [truncated]"
    fi
    # Escape backslashes, double quotes, newlines, carriage returns, and tabs
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    str="${str//$'\n'/\\n}"
    str="${str//$'\r'/\\r}"
    str="${str//$'\t'/\\t}"
    echo -n "$str"
}

# HTML escaping helper for Telegram notifications
escape_for_html() {
    local str="$1"
    str="${str//&/&amp;}"
    str="${str//</&lt;}"
    str="${str//>/&gt;}"
    echo -n "$str"
}

# Helper to send Telegram notification safely
notify_telegram() {
    local raw_message="$1"
    local is_success="${2:-0}"

    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
        echo "Telegram notification skipped (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured)."
        return 0
    fi

    local header="🚨 <b>Supabase Backup Alert</b>"
    if [ "$is_success" -eq 1 ]; then
        header="✅ <b>Supabase Backup Success</b>"
    fi

    local safe_msg=$(escape_for_html "$raw_message")
    local full_msg="$header

<code>$safe_msg</code>"

    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d "chat_id=$TELEGRAM_CHAT_ID" \
        --data-urlencode "text=$full_msg" \
        -d "parse_mode=HTML" > /dev/null 2>&1
}

# Helper to log to Supabase PostgREST
log_to_supabase() {
    local status="$1"
    local file_size="${2:-0}"
    local error_msg="$3"
    local finished_at="$4"

    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        echo "Warning: Supabase credentials not set. Skipping database log."
        return 0
    fi

    local safe_err=$(escape_for_json "$error_msg")
    local safe_dest=$(escape_for_json "$RCLONE_REMOTE_NAME:$RCLONE_DEST_PATH")

    local payload="{\"status\": \"$status\", \"file_name\": \"$BACKUP_NAME\", \"file_size\": $file_size, \"error_message\": \"$safe_err\", \"destination\": \"$safe_dest\""
    if [ -n "$finished_at" ]; then
        payload="$payload, \"finished_at\": \"$finished_at\""
    fi
    payload="$payload}"

    if [ -z "$LOG_ID" ]; then
        # Initial insert
        local response
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/backup_logs" \
            -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Content-Type: application/json" \
            -H "Prefer: return=representation" \
            -d "$payload")

        local http_code=$(echo "$response" | grep "HTTP_STATUS:" | cut -d':' -f2)
        local body=$(echo "$response" | grep -v "HTTP_STATUS:")

        if [[ "$http_code" =~ ^2 ]]; then
            # Extract id safely without depending on PCRE (-P)
            LOG_ID=$(echo "$body" | grep -o '"id":"[^"]*' | head -n 1 | cut -d'"' -f4)
            echo "Created backup log record in Supabase with ID: $LOG_ID"
        else
            echo "Warning: Failed to create initial Supabase backup log (HTTP $http_code): $body"
        fi
    else
        # Update existing record
        local update_res
        update_res=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/backup_logs?id=eq.$LOG_ID" \
            -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Content-Type: application/json" \
            -d "$payload")

        local update_code=$(echo "$update_res" | grep "HTTP_STATUS:" | cut -d':' -f2)
        if ! [[ "$update_code" =~ ^2 ]]; then
            echo "Warning: Failed to update Supabase backup log (HTTP $update_code): $update_res"
        fi
    fi
}

echo "=== Starting Supabase Backup at $(date) ==="

# 0. Validate DB_URL
if [ -z "$DB_URL" ]; then
    ERR="Fatal: DB_URL environment variable is missing or empty."
    echo "$ERR"
    log_to_supabase "failed" 0 "$ERR" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    notify_telegram "$ERR" 0
    exit 1
fi

# 1. Initialize Log as 'running'
log_to_supabase "running" 0 "" ""

# 2. Check and configure pg_dump
if [ -d "/usr/lib/postgresql/17/bin" ]; then
    export PATH="/usr/lib/postgresql/17/bin:$PATH"
elif [ -d "/usr/lib/postgresql/16/bin" ]; then
    export PATH="/usr/lib/postgresql/16/bin:$PATH"
fi

if ! command -v pg_dump &> /dev/null; then
    ERR="pg_dump command not found in PATH ($PATH). Please ensure postgresql-client is installed."
    echo "$ERR"
    log_to_supabase "failed" 0 "$ERR" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    notify_telegram "$ERR" 0
    exit 1
fi

echo "Using pg_dump version: $(pg_dump --version)"

# 3. Start Backup (pg_dump)
echo "Starting pg_dump to $LOCAL_FILE..."
PGSSLMODE=require pg_dump "$DB_URL" > "$LOCAL_FILE" 2> "$PG_ERR_LOG"
PG_EXIT=$?

if [ $PG_EXIT -ne 0 ]; then
    PG_STDERR=$(cat "$PG_ERR_LOG" | tail -n 12)
    ERR="pg_dump failed with exit code $PG_EXIT. Details:
$PG_STDERR"
    echo "$ERR"
    log_to_supabase "failed" 0 "$ERR" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    notify_telegram "$ERR" 0
    rm -f "$LOCAL_FILE"
    exit 1
fi

# 4. Check if file is suspiciously empty
FILE_SIZE=$(stat -c%s "$LOCAL_FILE" 2>/dev/null || stat -f%z "$LOCAL_FILE" 2>/dev/null || echo 0)
if [ "$FILE_SIZE" -le 100 ]; then
    ERR="Backup file is suspiciously small ($FILE_SIZE bytes). Potential query or auth failure."
    echo "$ERR"
    log_to_supabase "failed" "$FILE_SIZE" "$ERR" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    notify_telegram "$ERR" 0
    rm -f "$LOCAL_FILE"
    exit 1
fi

echo "pg_dump completed successfully. File size: $FILE_SIZE bytes."

# 5. Check rclone availability
if ! command -v rclone &> /dev/null; then
    ERR="rclone command not found. Cannot upload to cloud storage."
    echo "$ERR"
    log_to_supabase "failed" "$FILE_SIZE" "$ERR" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    notify_telegram "$ERR" 0
    exit 1
fi

# 6. Upload to Cloud Storage via rclone
# Normalize folder path: trim whitespace, remove leading/trailing slashes
RCLONE_DEST_PATH=$(echo "${RCLONE_DEST_PATH:-rifelo-backup}" | sed 's/^[ \t\/]*//;s/[ \t\/]*$//')

# If empty after trimming, enforce default folder "rifelo-backup"
if [ -z "$RCLONE_DEST_PATH" ]; then
    RCLONE_DEST_PATH="rifelo-backup"
fi

TARGET_DEST="$RCLONE_REMOTE_NAME:$RCLONE_DEST_PATH"

echo "Uploading $LOCAL_FILE into folder '$RCLONE_DEST_PATH' on remote '$RCLONE_REMOTE_NAME' via rclone copyto..."
RCLONE_OUTPUT=$(rclone copyto -v "$LOCAL_FILE" "$TARGET_DEST/$BACKUP_NAME" 2>&1)
RCLONE_EXIT=$?

if [ $RCLONE_EXIT -ne 0 ]; then
    echo "rclone failed with exit code $RCLONE_EXIT:"
    echo "$RCLONE_OUTPUT"

    TAIL_OUTPUT=$(echo "$RCLONE_OUTPUT" | tail -n 8 | sed 's/^[0-9\/ :]*//')
    ERR="rclone upload to $TARGET_DEST failed. Details:
$TAIL_OUTPUT"
    
    log_to_supabase "failed" "$FILE_SIZE" "$ERR" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    notify_telegram "$ERR" 0
    exit 1
fi

echo "rclone upload output:"
echo "$RCLONE_OUTPUT"

# Verify file existence inside the folder on Google Drive
echo "Verifying file inside folder ($TARGET_DEST)..."
rclone lsl "$TARGET_DEST/$BACKUP_NAME" 2>&1 || rclone lsf "$TARGET_DEST" 2>&1

# 7. Success
echo "=== Backup completed successfully! ==="
SIZE_KB=$((FILE_SIZE / 1024))
SUCCESS_MSG="Database backup uploaded successfully!
File: $BACKUP_NAME
Size: ${SIZE_KB} KB
Target: Google Drive ($TARGET_DEST)"

echo "$SUCCESS_MSG"
log_to_supabase "success" "$FILE_SIZE" "" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
notify_telegram "$SUCCESS_MSG" 1

# Cleanup local backup file
rm -f "$LOCAL_FILE"
echo "Local temporary file cleaned up."
exit 0
