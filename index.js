#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const apiUrl = (process.env.NYXLABS_API_URL || 'https://nyxlabs.app').replace(/\/$/, '');
const token = process.env.NYXLABS_MCP_TOKEN;

if (!token) {
  console.error('Missing NYXLABS_MCP_TOKEN');
  process.exit(1);
}

async function callNyx(tool, args = {}) {
  const response = await fetch(`${apiUrl}/api/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tool, arguments: args }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `NyxLabs MCP request failed (${response.status})`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload.result, null, 2),
      },
    ],
  };
}

const optionalFilters = {
  accountId: z.string().optional().describe('Filter by Nyx account id'),
  status: z.enum(['planned', 'open', 'closed']).optional().describe('Trade status'),
  pair: z.string().optional().describe('Pair/symbol filter'),
  setup: z.string().optional().describe('Setup filter'),
  start: z.string().optional().describe('Start date/time ISO string'),
  end: z.string().optional().describe('End date/time ISO string'),
};

const server = new McpServer({
  name: 'nyxlabs-mcp',
  version: '0.1.0',
});

server.tool('get_user_profile', 'Get the authenticated NyxLabs profile.', {}, () => callNyx('get_user_profile'));

server.tool('list_accounts', 'List NyxLabs trading accounts.', {
  includeArchived: z.boolean().optional().describe('Include archived accounts'),
}, (args) => callNyx('list_accounts', args));

server.tool('get_account_summary', 'Get account metadata and performance summary for one account.', {
  accountId: z.string().describe('Nyx account id'),
}, (args) => callNyx('get_account_summary', args));

server.tool('list_trades', 'List recent trades with optional filters.', {
  ...optionalFilters,
  limit: z.number().optional().describe('Maximum trades to return, max 100'),
}, (args) => callNyx('list_trades', args));

server.tool('search_trades', 'Search trades by pair, setup, rationale, or notes.', {
  query: z.string().describe('Search query'),
  ...optionalFilters,
  limit: z.number().optional().describe('Maximum trades to return, max 100'),
}, (args) => callNyx('search_trades', args));

server.tool('get_trade_detail', 'Get detailed context for one trade.', {
  tradeId: z.string().describe('Nyx trade id'),
}, (args) => callNyx('get_trade_detail', args));

server.tool('get_performance_summary', 'Get performance metrics across trades with optional filters.', {
  ...optionalFilters,
}, (args) => callNyx('get_performance_summary', args));

server.tool('get_open_trades', 'List currently open trades.', {}, () => callNyx('get_open_trades'));

server.tool('list_journal_notes', 'List recent journal notes.', {
  accountId: z.string().optional().describe('Filter by account id'),
  limit: z.number().optional().describe('Maximum notes to return, max 100'),
}, (args) => callNyx('list_journal_notes', args));

server.tool('search_journal_notes', 'Search journal notes by title or content.', {
  query: z.string().describe('Search query'),
  accountId: z.string().optional().describe('Filter by account id'),
  limit: z.number().optional().describe('Maximum notes to return, max 100'),
}, (args) => callNyx('search_journal_notes', args));

server.tool('get_partner_progress', 'Get partner rewards/progress context.', {}, () => callNyx('get_partner_progress'));

server.tool('get_exchange_connections_status', 'Get safe exchange connection status without credentials.', {}, () => callNyx('get_exchange_connections_status'));

const transport = new StdioServerTransport();
await server.connect(transport);
