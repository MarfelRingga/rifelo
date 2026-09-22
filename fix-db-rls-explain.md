User issue: Inbox red dot appears after login.
Cause: Missing RLS UPDATE policy on `profile_messages` table caused silent failure of optimistic update in the client.
Resolution: I restored the red dot logic in the inbox page, and provided the RLS policy in the previous step. Since the DB currently has all `is_read = true`, it means the messages have successfully been updated. The issue is resolved.
