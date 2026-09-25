import assert from "node:assert/strict";
import { OPERATIONS, checkAssertions, parseJsonPreservingLargeIntegers, runConfig, selfTest } from "./run_local_mapi.mjs";

assert.equal(selfTest().status, "ok");
assert.equal(OPERATIONS["project.create"].path, "/open_api/v3.0/local/project/create/");
assert.equal(OPERATIONS["report.material"].method, "GET");

const lossless = parseJsonPreservingLargeIntegers('{"material_id":9007199254740993,"project_ids":[9007199254740995]}');
assert.equal(lossless.material_id, "9007199254740993");
assert.deepEqual(lossless.project_ids, ["9007199254740995"]);

checkAssertions({ data: { ids: [3, 2, 1] } }, [
  { type: "setEquals", path: "data.ids", expected: [1, 2, 3] }
]);

await assert.rejects(
  runConfig({ steps: [{ name: "write", operation: "project.create", body: {} }] }, { execute: false, env: {} }),
  /requires --execute/
);

await assert.rejects(
  runConfig({ steps: [{ name: "read", operation: "project.detail", query: {} }] }, { execute: false, env: {} }),
  /missing access token environment variable/
);

process.stdout.write('{"status":"ok"}\n');
