---
name: douyin-global-double-zero-cleanup
description: Delete only Douyin 巨量本地推全域 individual videos whose exact performance metrics are spend=0 and revenue=0. Use when the user explicitly asks to remove 0消耗0产出 or 双零 videos. Never delete spend-positive videos and never read or write the observation ledger.
---

# 抖音全域删除0消耗0产出

## 后台优先与前台兜底

执行优先级：先使用已授权、可用且能精确绑定账号与页面的端口/浏览器后台连接、参数化脚本或官方接口；其次使用已登录页面的后台同源请求；仅在相关后台路径确实不可用时使用前台兜底。官方接口已满足任务时不必为端口方式额外探测。不能把“后台优先”解释为“禁止所有前台操作”。

使用已有端口连接前核对工具允许的访问方式、浏览器资料、准确 URL 和账号/计划；不盲扫端口，不自行开启调试权限，不绕过工具限制或另建登录环境。页面 JavaScript/DOM 操作与系统键鼠分开判断，正常后台执行不激活窗口。

启用前台兜底前说明后台失败的具体证据、拟操作范围与预计占用方式；当前任务已授权该兜底且工具允许时继续，不逐批重复确认。如果用户正在使用前台、明确要求本次全程后台，或工具要求额外批准，则先协调必要的前台时段/授权。优先最少量的语义操作或一次 Console 参数化脚本提交，避免逐条鼠标重复操作及盲目坐标回放。

接口明确禁止调用、账号不匹配、登录挑战或权限拒绝不得通过换通道绕过。一般能力不支持时可采用获准的正常页面操作；写入结果不确定时，先回读并恢复检查点，绝不因切换前后台而重复提交。原有素材保留、删除授权、准确 ID 与回读验收规则始终有效。无法完成的页面验收如实记录；用户明确接受本次接口验收时按该范围交付。


## 执行路由与批量验收

开始旧全域清理、处理近期保护或恢复未完成批次时，先读 [references/batch-cleanup.md](references/batch-cleanup.md)。它覆盖已批准范围的连续执行、MAPI 能力核对、正常页面按 ID 批量勾选、完整列表回读和检查点恢复。

用户已有的账户、计划、日期与删除授权在同一任务内持续有效；不逐批重新询问。近期加入保护须证明加入时间，不能直接以素材创建时间代替。原有接口 runner 没有近期保护参数，需先落实保护清单与批准 ID 约束，不能直接全量执行旧命令。

## MAPI route

Use the bundled `scripts/run_local_mapi.mjs` first for `report.material` plus `promotion.detail`; read [references/mapi-config.md](references/mapi-config.md) when composing the run. Filter only exact parsed `cost === 0` and revenue/GMV `=== 0` rows in the requested inclusive interval. If the official detail response proves that the plan type supports a complete `promotion.update` material list, remove only those exact IDs, write once, and fresh-read the unit and report. The MAPI runner is included in this Skill and has no cross-Skill dependency.

Treat every platform ID as a string. Responses and configs can contain 16–19 digit IDs that exceed JavaScript's safe integer range; parse them losslessly and never compare or submit a rounded numeric ID.

Treat missing metrics, missing material identity, an unsupported global-plan schema, or an unavailable update scope as a reason to use the existing exact-plan Chrome runner. Never combine MAPI and internal-page deletion in one run, and never retry a mutation whose result is uncertain.

Use the current logged-in Google Chrome profile and one exact `advid + adId + pt + type=edit` tab. Use an inclusive performance interval.

Delete only active individual videos with parsed exact metrics `spend === 0` and `revenue === 0`. Never delete spend-positive videos. Treat blank, `-`, null, missing, or unparseable metrics as unknown and retain them.

Chrome fallback:

```bash
node ${CODEX_HOME:-$HOME/.codex}/skills/douyin-global-double-zero-cleanup/scripts/run_cleanup.mjs \
  --advid <advertiser-id> --adid <plan-id> \
  --pt <videopoi|liveproduct> --surface <store_global|live_global> \
  --performance-start YYYY-MM-DD --performance-end YYYY-MM-DD \
  --execute
```

Use `store_global + videopoi` for 门店全域 and `live_global + liveproduct` for 直播全域. Omit `--execute` for the default preview; supply the published target/count guards for an authorized write.

This Skill does not accept `--rule` or `--commit-ledger`; its runner is fixed to double-zero and cannot update the spend-positive observation ledger.

Accept completion only with `status=verified`, `rule=double-zero`, `stillActive=[]`, and `spendPositiveDeletedCount=0`. Stop on any mismatch or uncertain mutation.

## 发布版执行参数

后台优先策略不改变发布版预演和目标校验。已授权任务由执行者填写这些参数，不代表需要逐批再次询问用户。

清理 runner 默认预演；执行使用 `--execute --confirm-plan-id <与adid一致> --confirm-delete-count <预演删除数>`。

`applescript_eval.sh` 默认不激活窗口；仅获准的前台兜底同时使用 `--activate --allow-foreground`。没有该 helper 的技能按其连接器流程执行。
