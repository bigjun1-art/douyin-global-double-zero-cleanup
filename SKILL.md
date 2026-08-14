---
name: douyin-global-double-zero-cleanup
description: Delete only Douyin 巨量本地推全域 individual videos whose exact performance metrics are spend=0 and revenue=0. Use when the user explicitly asks to remove 0消耗0产出 or 双零 videos. Never delete spend-positive videos and never read or write the observation ledger.
---

# 抖音全域删除0消耗0产出

Use the current logged-in Google Chrome profile and one exact `advid + adId + pt + type=edit` tab. Use an inclusive performance interval.

Delete only active individual videos with parsed exact metrics `spend === 0` and `revenue === 0`. Never delete spend-positive videos. Treat blank, `-`, null, missing, or unparseable metrics as unknown and retain them.

Run:

```bash
cd <skill-directory>
node scripts/run_cleanup.mjs \
  --advid <advertiser-id> --adid <plan-id> \
  --pt <videopoi|liveproduct> --surface <store_global|live_global> \
  --performance-start YYYY-MM-DD --performance-end YYYY-MM-DD
```

The command above is always a preview. Review `deleteCount` and the exact plan ID before any deletion. Execute only with both confirmations copied from that preview:

```bash
node scripts/run_cleanup.mjs <same-arguments> --execute \
  --confirm-plan-id <plan-id> --confirm-delete-count <preview-deleteCount>
```

Use `store_global + videopoi` for 门店全域 and `live_global + liveproduct` for 直播全域.

This Skill does not accept `--rule` or `--commit-ledger`; its runner is fixed to double-zero and cannot update the spend-positive observation ledger.

Accept completion only with `status=verified`, `rule=double-zero`, `stillActive=[]`, and `spendPositiveDeletedCount=0`. Stop on any mismatch or uncertain mutation.
