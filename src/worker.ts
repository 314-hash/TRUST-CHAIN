/**
 * TRUSTCHAIN AUDIT — Cloudflare Serverless Worker
 * Powers edge execution, Base L2 RPC reverse proxy, and API endpoints
 */

export interface Env {
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  ENVIRONMENT?: string;
  BASE_RPC_URL?: string;
}

// In-memory edge stores (persisted across warm isolates)
const SEEDED_BIR_SESSIONS = [
  {
    sessionId: 'BIR-SESS-984210',
    passcode: 'BIR-2026-9842-X7',
    auditorName: 'Atty. Ma. Elena Santos',
    auditorBirId: 'BIR-RDO033-88492',
    rdoCode: 'RDO 033 - Intramuros / Large Taxpayers Service (LTS)',
    assignedPlatform: 'CineChain Streaming Ltd. / CineFlix Media',
    platformTin: '009-842-192-000',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false,
    status: 'ACTIVE_UNUSED',
  },
  {
    sessionId: 'BIR-SESS-109384',
    passcode: 'BIR-2026-4410-Q1',
    auditorName: 'Auditor Juan Dela Cruz, CPA',
    auditorBirId: 'BIR-RDO039-44102',
    rdoCode: 'RDO 039 - South Quezon City',
    assignedPlatform: 'CineChain Streaming Ltd. / CineFlix Media',
    platformTin: '009-842-192-000',
    expiresAt: '2026-11-10T08:00:00Z',
    isUsed: true,
    usedAt: '2026-11-10T08:14:22Z',
    status: 'EXPIRED_USED',
  },
];

const SEEDED_TAX_DECLARATIONS = [
  {
    id: 'TAX-DECL-2026-01-M',
    declarationNumber: 'BIR-DECL-2026-M01',
    platformName: 'CineChain Streaming Ltd. (CineFlix Media Technologies Inc.)',
    tin: '009-842-192-000',
    rdoOffice: 'RDO 033 - Large Taxpayers Regular Audit Division (LTRAD 1)',
    periodType: 'monthly',
    periodName: 'January 2026',
    year: 2026,
    totalPaidSubscribers: 28450,
    plans: [
      { planName: 'Mobile Only (SD)', tier: 'mobile', priceMonthlyPhp: 149, activePaidSubscribers: 12200, grossRevenuePhp: 1817800 },
      { planName: 'Standard (Full HD 1080p)', tier: 'standard', priceMonthlyPhp: 369, activePaidSubscribers: 11500, grossRevenuePhp: 4243500 },
      { planName: 'Premium Ultra (4K HDR + Spatial)', tier: 'premium', priceMonthlyPhp: 549, activePaidSubscribers: 4750, grossRevenuePhp: 2607250 },
    ],
    grossSubscriptionsPhp: 8668550,
    allowableDeductionsPhp: 1040226,
    netTaxableIncomePhp: 7628324,
    vatRatePercent: 12,
    vatAmountPhp: 1040226,
    withholdingTaxPhp: 152566.48,
    totalTaxDuePhp: 1192792.48,
    paymentGatewayBreakdown: [
      { gateway: 'GCash / Maya Digital Wallets (PayMongo)', percentage: 54.2, amountPhp: 4698354.1 },
      { gateway: 'Credit / Debit Cards (Stripe)', percentage: 38.6, amountPhp: 3346060.3 },
      { gateway: 'Base L2 USDC Streaming Subscription Vault', percentage: 7.2, amountPhp: 624135.6 },
    ],
    smartContractAnchorTx: '0x7b2f4c91038e2194a5bd017592e8ca8e3b0921a80c9529e0182740bc1829da42',
    blockchainEvidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    birDocumentTrackingNumber: 'BIR-DTN-2026-STRM-089421',
    filingTimestamp: '2026-02-15T10:30:00Z',
    auditorName: 'Atty. Ma. Elena Santos',
    auditorBirId: 'BIR-RDO033-88492',
    stampedStatus: 'FILED_AND_CONFIRMED',
  },
  {
    id: 'TAX-DECL-2026-02-M',
    declarationNumber: 'BIR-DECL-2026-M02',
    platformName: 'CineChain Streaming Ltd. (CineFlix Media Technologies Inc.)',
    tin: '009-842-192-000',
    rdoOffice: 'RDO 033 - Large Taxpayers Regular Audit Division (LTRAD 1)',
    periodType: 'monthly',
    periodName: 'February 2026',
    year: 2026,
    totalPaidSubscribers: 31200,
    plans: [
      { planName: 'Mobile Only (SD)', tier: 'mobile', priceMonthlyPhp: 149, activePaidSubscribers: 13100, grossRevenuePhp: 1951900 },
      { planName: 'Standard (Full HD 1080p)', tier: 'standard', priceMonthlyPhp: 369, activePaidSubscribers: 12800, grossRevenuePhp: 4723200 },
      { planName: 'Premium Ultra (4K HDR + Spatial)', tier: 'premium', priceMonthlyPhp: 549, activePaidSubscribers: 5300, grossRevenuePhp: 2909700 },
    ],
    grossSubscriptionsPhp: 9584800,
    allowableDeductionsPhp: 1150176,
    netTaxableIncomePhp: 8434624,
    vatRatePercent: 12,
    vatAmountPhp: 1150176,
    withholdingTaxPhp: 168692.48,
    totalTaxDuePhp: 1318868.48,
    paymentGatewayBreakdown: [
      { gateway: 'GCash / Maya Digital Wallets (PayMongo)', percentage: 56.1, amountPhp: 5377072.8 },
      { gateway: 'Credit / Debit Cards (Stripe)', percentage: 36.4, amountPhp: 3488867.2 },
      { gateway: 'Base L2 USDC Streaming Subscription Vault', percentage: 7.5, amountPhp: 718860.0 },
    ],
    smartContractAnchorTx: '0x3a4f910481bc29487501a4e819b48912ef01a89c0172e8194b01e8a93bc41029',
    blockchainEvidenceHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    birDocumentTrackingNumber: 'BIR-DTN-2026-STRM-091044',
    filingTimestamp: '2026-03-15T09:15:00Z',
    auditorName: 'Atty. Ma. Elena Santos',
    auditorBirId: 'BIR-RDO033-88492',
    stampedStatus: 'FILED_AND_CONFIRMED',
  },
  {
    id: 'TAX-DECL-2026-Q1',
    declarationNumber: 'BIR-DECL-2026-Q01',
    platformName: 'CineChain Streaming Ltd. (CineFlix Media Technologies Inc.)',
    tin: '009-842-192-000',
    rdoOffice: 'RDO 033 - Large Taxpayers Regular Audit Division (LTRAD 1)',
    periodType: 'quarterly',
    periodName: 'Q1 2026 (January - March 2026)',
    year: 2026,
    totalPaidSubscribers: 94850,
    plans: [
      { planName: 'Mobile Only (SD)', tier: 'mobile', priceMonthlyPhp: 149, activePaidSubscribers: 40500, grossRevenuePhp: 6034500 },
      { planName: 'Standard (Full HD 1080p)', tier: 'standard', priceMonthlyPhp: 369, activePaidSubscribers: 38200, grossRevenuePhp: 14095800 },
      { planName: 'Premium Ultra (4K HDR + Spatial)', tier: 'premium', priceMonthlyPhp: 549, activePaidSubscribers: 16150, grossRevenuePhp: 8866350 },
    ],
    grossSubscriptionsPhp: 28996650,
    allowableDeductionsPhp: 3479598,
    netTaxableIncomePhp: 25517052,
    vatRatePercent: 12,
    vatAmountPhp: 3479598,
    withholdingTaxPhp: 510341.04,
    totalTaxDuePhp: 3989939.04,
    paymentGatewayBreakdown: [
      { gateway: 'GCash / Maya Digital Wallets (PayMongo)', percentage: 55.4, amountPhp: 16064144.1 },
      { gateway: 'Credit / Debit Cards (Stripe)', percentage: 37.1, amountPhp: 10757757.15 },
      { gateway: 'Base L2 USDC Streaming Subscription Vault', percentage: 7.5, amountPhp: 2174748.75 },
    ],
    smartContractAnchorTx: '0x88f1a09149ba18e7c10481bc9204918e7b1a049c182740bc1892da419401e8a9',
    blockchainEvidenceHash: '4a1b83d1c44810e9f028491bbcf29841804918cba09184ba0918491ba0194819',
    birDocumentTrackingNumber: 'BIR-DTN-2026-STRM-Q1-104928',
    filingTimestamp: '2026-04-15T11:45:00Z',
    auditorName: 'Atty. Ma. Elena Santos',
    auditorBirId: 'BIR-RDO033-88492',
    stampedStatus: 'FILED_AND_CONFIRMED',
  },
];

const birSessions = [...SEEDED_BIR_SESSIONS];
const taxDeclarations = [...SEEDED_TAX_DECLARATIONS];

// CORS Helpers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Base L2 Direct RPC Reverse Proxy (/rpc and /rpc/sepolia)
    if (url.pathname === '/rpc' || url.pathname.startsWith('/rpc/')) {
      const isSepolia = url.pathname.includes('sepolia');
      const targetRpc = isSepolia
        ? 'https://sepolia.base.org'
        : env.BASE_RPC_URL || 'https://mainnet.base.org';

      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', new URL(targetRpc).host);

      try {
        const rpcRes = await fetch(targetRpc, {
          method: request.method,
          headers: forwardHeaders,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        });

        const newHeaders = new Headers(rpcRes.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));

        return new Response(rpcRes.body, {
          status: rpcRes.status,
          headers: newHeaders,
        });
      } catch (err: any) {
        return jsonResponse({ error: 'RPC proxy failure', details: err.message }, 502);
      }
    }

    // 3. API Endpoints (/api/*)
    if (url.pathname.startsWith('/api')) {
      // Health
      if (url.pathname === '/api/health') {
        return jsonResponse({
          status: 'ok',
          platform: 'TrustChain Cloudflare Serverless Worker',
          runtime: 'Cloudflare Workers (W8 Edge)',
          mode: 'serverless-edge',
          network: 'Base L2 (8453)',
          timestamp: new Date().toISOString(),
        });
      }

      // BIR Tax Auditor Sessions
      if (url.pathname === '/api/bir/sessions' && request.method === 'GET') {
        return jsonResponse(birSessions);
      }

      // Provision new BIR single-use passcode
      if (url.pathname === '/api/bir/provision-session' && request.method === 'POST') {
        try {
          const body: any = await request.json();
          const pin = Math.floor(1000 + Math.random() * 9000);
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let suffix = '';
          for (let i = 0; i < 2; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));

          const newSession = {
            sessionId: `BIR-SESS-${Date.now().toString(36).toUpperCase()}`,
            passcode: `BIR-2026-${pin}-${suffix}`,
            auditorName: body.auditorName || 'Atty. Assigned Auditor',
            auditorBirId: body.auditorBirId || 'BIR-RDO033-99120',
            rdoCode: body.rdoCode || 'RDO 033 - Large Taxpayers Regular Audit Division',
            assignedPlatform: body.assignedPlatform || 'CineChain Streaming Ltd. (CineFlix Media)',
            platformTin: body.platformTin || '009-842-192-000',
            expiresAt: new Date(Date.now() + (body.ttlMinutes || 15) * 60 * 1000).toISOString(),
            isUsed: false,
            status: 'ACTIVE_UNUSED',
          };
          birSessions.unshift(newSession);
          return jsonResponse({ session: newSession });
        } catch {
          return jsonResponse({ error: 'Invalid JSON request' }, 400);
        }
      }

      // Verify and BURN single-use passcode
      if (url.pathname === '/api/bir/verify-access' && request.method === 'POST') {
        try {
          const body: any = await request.json();
          const clean = (body.passcode || '').trim().toUpperCase();
          const session = birSessions.find((s) => s.passcode.toUpperCase() === clean || s.sessionId === clean);

          if (!session) {
            return jsonResponse({ error: 'Invalid BIR Auditor Passcode.' }, 401);
          }

          if (session.isUsed || session.status === 'EXPIRED_USED') {
            return jsonResponse({
              error: `Security Alert: This passcode (${session.passcode}) has already been used and was burned. Single-use passwords expire after every use for security.`,
            }, 401);
          }

          if (Date.now() > new Date(session.expiresAt).getTime()) {
            session.status = 'EXPIRED_TIMEOUT';
            return jsonResponse({ error: 'Security Alert: This passcode has expired due to timeout.' }, 401);
          }

          // Burn passcode immediately!
          session.isUsed = true;
          session.status = 'EXPIRED_USED';
          (session as any).usedAt = new Date().toISOString();

          return jsonResponse({
            authorized: true,
            message: 'BIR Auditor authenticated successfully. Passcode has been burned after this use for security.',
            session,
            declarations: taxDeclarations,
          });
        } catch {
          return jsonResponse({ error: 'Failed to verify passcode' }, 400);
        }
      }

      // Paid Subscriptions & Tax Declarations
      if (url.pathname === '/api/bir/subscriptions' && request.method === 'GET') {
        return jsonResponse(taxDeclarations);
      }

      if (url.pathname.startsWith('/api/bir/declarations/')) {
        const id = url.pathname.replace('/api/bir/declarations/', '');
        const decl = taxDeclarations.find((d) => d.id === id || d.declarationNumber === id);
        return decl ? jsonResponse(decl) : jsonResponse({ error: 'Declaration not found' }, 404);
      }

      // Certificates list
      if (url.pathname === '/api/certificates' && request.method === 'GET') {
        return jsonResponse([
          {
            certificateId: 'TC-CERT-STRM-8819',
            title: 'CineFlix 4K Master Video & DRM Attestation',
            entityType: 'movie',
            entityId: 'MOV-CYBER-2026-01',
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            onChainStatus: 'registered_onchain',
            txHash: '0x7b2f4c91038e2194a5bd017592e8ca8e3b0921a80c9529e0182740bc1829da42',
            chainId: 8453,
            chainName: 'Base (Coinbase L2)',
            blockNumber: 19842012,
            explorerUrl: 'https://basescan.org/tx/0x7b2f4c91038e2194a5bd017592e8ca8e3b0921a80c9529e0182740bc1829da42',
            issuer: '0x71C8354366A96C2522778B27bF13fF1A3d596495',
            issuedAt: '2026-11-08T12:00:00Z',
            publicVerificationUrl: '/?verify=TC-CERT-STRM-8819',
          },
        ]);
      }

      // Default API fallback
      return jsonResponse({
        message: 'TrustChain Cloudflare Serverless Edge API',
        endpoints: ['/api/health', '/api/bir/sessions', '/api/bir/subscriptions', '/api/certificates', '/rpc'],
      });
    }

    // 4. Static Assets from Cloudflare Pages / Workers Assets
    if (env.ASSETS) {
      try {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes.status !== 404) {
          return assetRes;
        }
        // SPA Fallback for client routes
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        return await env.ASSETS.fetch(indexRequest);
      } catch {
        // Continue to fallback
      }
    }

    // Default response if no static asset binding is attached
    return new Response(
      `<!DOCTYPE html><html><head><title>TrustChain Serverless</title></head><body style="background:#0a0d14;color:#fff;font-family:sans-serif;padding:40px;"><h2>TrustChain Audit — Cloudflare Worker Online</h2><p>Base L2 RPC Proxy active at <a style="color:#f59e0b" href="/rpc">/rpc</a></p><p>API Status: <a style="color:#f59e0b" href="/api/health">/api/health</a></p></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } }
    );
  },
};
