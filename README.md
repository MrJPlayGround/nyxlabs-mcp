# NyxLabs MCP

NyxLabs MCP lets your own AI client read your NyxLabs trading journal context.

Use it to ask questions about your accounts, trades, journal notes, open positions, performance, partner progress, and exchange sync status.

V1 is read-only. It cannot place trades, close positions, transfer funds, change leverage, change margin mode, or read exchange API secrets.

## Requirements

- A NyxLabs account with journal or account data.
- An MCP-capable AI client, such as Claude Desktop, Cursor, or another local agent client.
- Node.js 20 or newer.
- A NyxLabs MCP token created from Settings -> AI.

Your AI account is your own account. NyxLabs does not provide or route through a Nyx-owned AI key.

## Quick Start

1. Open NyxLabs.
2. Go to Settings -> AI.
3. Create a new MCP token.
4. Copy the token immediately. NyxLabs only shows the full token once.
5. Add the server config below to your AI client's MCP settings.
6. Restart or reload your AI client.
7. Ask the AI client to use NyxLabs.

```json
{
  "mcpServers": {
    "nyxlabs": {
      "command": "npx",
      "args": ["-y", "github:MrJPlayGround/nyxlabs-mcp#v0.1.0"],
      "env": {
        "NYXLABS_API_URL": "https://nyxlabs.app",
        "NYXLABS_MCP_TOKEN": "nyx_mcp_REPLACE_ME"
      }
    }
  }
}
```

Replace `nyx_mcp_REPLACE_ME` with the token from NyxLabs.

The `#v0.1.0` suffix pins testers to a known release. The NyxLabs team will publish a new tag when the MCP client changes.

## Token Scopes

When creating a token, choose only the data you want your AI client to read.

Available scopes:

- `profile:read` - profile and subscription context.
- `accounts:read` - trading account metadata and account summaries.
- `trades:read` - trade lists, trade search, open trades, and trade details.
- `notes:read` - journal note lists and journal note search.
- `performance:read` - performance summaries computed from trades.
- `partners:read` - partner progress and rewards context.
- `connections:read` - safe exchange connection status, without credentials.

You can revoke a token anytime in Settings -> AI.

## Available Tools

The AI client may call these read-only tools:

| Tool | What it reads |
| --- | --- |
| `get_user_profile` | Your NyxLabs profile context |
| `list_accounts` | Trading accounts |
| `get_account_summary` | One account plus performance stats |
| `list_trades` | Recent trades with optional filters |
| `search_trades` | Trades matching pair, setup, rationale, or notes |
| `get_trade_detail` | Full context for one trade |
| `get_performance_summary` | Aggregated performance metrics |
| `get_open_trades` | Currently open trades |
| `list_journal_notes` | Recent journal notes |
| `search_journal_notes` | Journal notes matching title or content |
| `get_partner_progress` | Partner reward/progress context |
| `get_exchange_connections_status` | Exchange sync status without API keys |

## Example Prompts

Try prompts like:

- "Use NyxLabs to analyze my last 30 losing trades. What patterns repeat?"
- "Compare my BTC and ETH performance over the last 90 days."
- "Find trades where my rationale mentioned FOMO, chasing, or revenge."
- "Which setup has my best expectancy?"
- "Summarize my open trades and point out risk concentration."
- "Look at my journal notes and trades from this week. What should I focus on next week?"
- "Compare funded accounts versus personal accounts."
- "Check whether my exchange connections are syncing cleanly."

For better answers, ask the AI client to show which NyxLabs tools it used and what filters it applied.

## Tester Checklist

Please test:

- Token creation in Settings -> AI.
- Copying the one-time token and config snippet.
- Connecting from your MCP client.
- Trade list and trade search quality.
- Account summary and performance summary accuracy.
- Journal note search quality.
- Open trade context.
- Partner progress context, if you use partner rewards.
- Token revocation.
- Error messages when a token is missing, revoked, or underscoped.

Send feedback with:

- AI client name and version.
- Operating system.
- The prompt you tried.
- Whether the AI used the expected NyxLabs tool.
- Any incorrect data, missing data, confusing wording, or setup friction.

Do not send your full MCP token in feedback.

## Safety Notes

- Treat an MCP token like a password.
- Only use it in AI clients you trust.
- Do not paste the token into public chats, screenshots, Discord, or support tickets.
- Revoke old test tokens after testing.
- Create separate tokens for different AI clients when possible.

NyxLabs stores only a hash of the token. If you lose the full token, create a new one.

## Troubleshooting

### `Missing NYXLABS_MCP_TOKEN`

Your MCP client did not pass the token environment variable to the server. Check the `env` block in your MCP config.

### `Invalid or expired MCP token`

The token is wrong, revoked, expired, or copied with extra characters. Create a new token in Settings -> AI and update your client config.

### `Missing MCP scope`

The token does not include the scope needed for that tool. Create a new token with the missing read scope.

### `nyxlabs-mcp` cannot be downloaded

The MCP client is installed from GitHub. Confirm the repo is reachable:

```bash
git ls-remote https://github.com/MrJPlayGround/nyxlabs-mcp.git refs/tags/v0.1.0
```

If your network blocks GitHub downloads, clone the repo locally and point your MCP client at the local `index.js`.

### The AI client does not see NyxLabs tools

Restart the AI client after changing MCP config. Some clients only load MCP servers at startup.

### The answers look incomplete

Ask the AI to fetch more specific data, for example:

- "Use `search_trades` for BTC trades from the last 90 days."
- "Use `get_trade_detail` for the biggest losing trade."
- "Use `get_performance_summary` filtered to closed trades."

## Local Smoke Test

After configuring a token, you can confirm the backend is live:

```bash
curl https://nyxlabs.app/api/mcp
```

Expected response:

```json
{
  "status": "ok",
  "name": "nyxlabs-mcp",
  "mode": "read-only"
}
```

Authenticated tool calls should be made by the MCP client. Avoid putting your token into shell history unless you know how to clear it.
