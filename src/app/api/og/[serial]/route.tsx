import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'edge';

interface RouteParams {
  params: Promise<{
    serial: string;
  }>;
}

const GATE_LABELS: Record<string, string> = {
  heart: '心門',
  wisdom: '智門',
  energy: '気門',
  time: '時門',
};

const GATE_COLORS: Record<string, string> = {
  heart: '#c026d3',
  wisdom: '#3b82f6',
  energy: '#2dd4bf',
  time: '#d4af37',
};

const RANK_COLORS: Record<string, string> = {
  '覚醒者': '#ffd700',
  '守護者': '#a855f7',
  '修行者': '#3b82f6',
  '探求者': '#2dd4bf',
  '目覚めの時': '#94a3b8',
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { serial } = await params;

    if (!serial) {
      return new Response('Serial is required', { status: 400 });
    }

    const supabase = createServerClient();

    const { data: diagnosis, error } = await supabase
      .from('diagnoses')
      .select('last_name, scores, rank')
      .eq('serial', serial)
      .single();

    if (error || !diagnosis) {
      return new Response('Diagnosis not found', { status: 404 });
    }

    const lastName = diagnosis.last_name || 'ゲスト';
    const scores = diagnosis.scores as { heart: number; wisdom: number; energy: number; time: number; total: number } | null;
    const rank = diagnosis.rank || '探求者';
    const totalScore = scores?.total ?? 0;
    const rankColor = RANK_COLORS[rank] || '#94a3b8';

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 36,
                color: '#ffffff',
                letterSpacing: 4,
              }}
            >
              ✨ Spirituals ✨
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: 30,
            }}
          >
            {lastName}様の診断結果
          </div>

          {/* Rank Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 40px',
              borderRadius: 30,
              background: rankColor,
              marginBottom: 30,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: rank === '覚醒者' ? '#1a1a2e' : '#ffffff',
              }}
            >
              {rank}
            </span>
          </div>

          {/* Total Score */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              {totalScore}
            </span>
            <span
              style={{
                fontSize: 32,
                color: '#94a3b8',
                marginLeft: 8,
              }}
            >
              / 100
            </span>
          </div>

          {/* Gate Scores */}
          <div
            style={{
              display: 'flex',
              gap: 24,
            }}
          >
            {(['heart', 'wisdom', 'energy', 'time'] as const).map((gate) => (
              <div
                key={gate}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    color: GATE_COLORS[gate],
                    marginBottom: 8,
                  }}
                >
                  {GATE_LABELS[gate]}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#ffffff',
                  }}
                >
                  {scores?.[gate] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
