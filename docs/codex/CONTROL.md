# Codex Control Plane

## Purpose

GitHub is the shared coordination layer between the project owner, ChatGPT technical review, and Codex implementation.

## Standard flow

1. The active task is written in `docs/codex/queue/current-task.md`.
2. Codex verifies branch, HEAD, working-tree state, scope, and stop conditions.
3. Codex implements only the authorized Micro Task.
4. Codex runs the required validation gate.
5. Codex updates `docs/codex/status/latest.md`.
6. Codex commits, pushes the task branch, and opens or updates a Draft PR when authorized.
7. Technical review is performed from the GitHub diff, CI results, and task report.
8. Codex addresses review findings on the same task branch.
9. Merge requires explicit human approval.

## Task contract

Every active task must define:

- Task ID
- objective
- reason and current problem
- base branch and expected base commit
- allowed files
- forbidden files
- implementation steps
- acceptance criteria
- required tests
- risks
- rollback approach
- publication permission

## Default autonomy

Codex may autonomously inspect, edit allowed files, add tests, run validation, update reports, commit, push a task branch, and create a Draft PR when the task grants publication permission.

Codex must not autonomously approve or merge its own PR, change protected architecture, introduce migrations, modify security/payment/auth boundaries, or alter dependencies unless explicitly authorized.

## Report handling

Reports remain in the repository. Do not require manual copying into chat. The latest task state is always written to `docs/codex/status/latest.md`, and durable task reports may be added under `docs/codex/reports/`.

## Failure policy

On validation failure, scope mismatch, merge conflict, or uncertain destructive impact:

- stop implementation
- preserve the working tree
- update `latest.md` with evidence
- add the exact unresolved decision to `pending.md`
- do not push partial unsafe work unless the task explicitly requests a diagnostic branch
