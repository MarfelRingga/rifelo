import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

describe('GET Token Redirect Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSupabaseQuery = (tagData: any, profileData?: any) => {
    vi.mocked(supabaseAdmin.from).mockImplementation((table: any) => {
      const data = table === 'nfc_tags' ? tagData : profileData;
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
        }),
      });
      return { select: mockSelect } as any;
    });
  };

  const createRequest = () => new Request('https://localhost:3000/t/abc');

  it('redirects to external url when mode is redirect', async () => {
    mockSupabaseQuery({
      user_id: 'user123',
      status: 'active',
      interaction_mode: 'redirect',
      redirect_url: 'google.com',
    });

    const response = await GET(createRequest(), { params: Promise.resolve({ token: 'abc' }) } as any);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://google.com/');
  });

  it('redirects to circle slug when mode is circle', async () => {
    mockSupabaseQuery({
      user_id: 'user123',
      status: 'active',
      interaction_mode: 'circle',
      redirect_url: null,
      circles: { slug: 'cool-circle' },
    });

    const response = await GET(createRequest(), { params: Promise.resolve({ token: 'abc' }) } as any);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://localhost:3000/c/cool-circle');
  });

  it('redirects to profile username when mode is profile', async () => {
    mockSupabaseQuery({
      user_id: 'user123',
      status: 'active',
      interaction_mode: 'profile',
    }, { username: 'john_doe' });

    const response = await GET(createRequest(), { params: Promise.resolve({ token: 'abc' }) } as any);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://localhost:3000/u/john_doe');
  });

  it('redirects to claim if not claimed', async () => {
    mockSupabaseQuery({
      user_id: null,
      status: 'active',
    });

    const response = await GET(createRequest(), { params: Promise.resolve({ token: 'abc' }) } as any);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://localhost:3000/claim?token=abc');
  });
});
