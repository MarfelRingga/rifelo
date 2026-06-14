import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTokenDestination } from './page';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Mock Supabase admin
vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

// Mock experimental cache
vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn, // direct pass-through for tests
}));

describe('fetchTokenDestination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSupabaseQuery = (data: any, error: any = null) => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data, error }),
      }),
    });
    vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as any);
  };

  it('should redirect to external URL when mode is redirect', async () => {
    mockSupabaseQuery({
      user_id: 'user123',
      status: 'active',
      interaction_mode: 'redirect',
      redirect_url: 'google.com',
      circle_id: null,
      circles: null,
      profiles: null,
    });

    const result = await fetchTokenDestination('abc');
    expect(result.isValid).toBe(true);
    expect(result.destination).toBe('https://google.com');
  });

  it('should redirect to circle slug when mode is circle', async () => {
    mockSupabaseQuery({
      user_id: 'user123',
      status: 'active',
      interaction_mode: 'circle',
      redirect_url: null,
      circle_id: 'c123',
      circles: { slug: 'cool-circle' },
      profiles: null,
    });

    const result = await fetchTokenDestination('abc');
    expect(result.isValid).toBe(true);
    expect(result.destination).toBe('/c/cool-circle');
  });

  it('should redirect to username when mode is profile with joined data', async () => {
    // If we successfully join profiles, it should be in the first query result
    mockSupabaseQuery({
      user_id: 'user123',
      status: 'active',
      interaction_mode: 'profile',
      redirect_url: null,
      circle_id: null,
      circles: null,
      profiles: { username: 'john_doe' },
    });

    const result = await fetchTokenDestination('abc');
    expect(result.isValid).toBe(true);
    expect(result.destination).toBe('/u/john_doe');
  });

  it('should redirect to claim if not claimed or active but no user', async () => {
    mockSupabaseQuery(null, null); // no tag

    let result = await fetchTokenDestination('abc');
    expect(result.isValid).toBe(false);

    mockSupabaseQuery({
      user_id: null,
      status: 'active',
      interaction_mode: 'profile',
      redirect_url: null,
      circle_id: null,
      circles: null,
      profiles: null,
    });

    result = await fetchTokenDestination('abc');
    expect(result.isValid).toBe(true);
    expect(result.destination).toBe('/claim?token=abc');
  });
});
