# Git Branching Strategy

## Overview
For the development of the Smart Adaptive Recovery System (SARS), we follow a simplified **Trunk-Based Development** strategy, tailored for a rapid MVP lifecycle.

---

## Branches

### 1. `main` (Trunk)
- The main branch is the single source of truth.
- It must always be in a deployable state.
- All code is ultimately merged here.

### 2. Feature Branches
- Created for every new feature, task, or bug fix.
- Branched off `main`.
- Naming Convention: `type/brief-description`

**Types:**
- `feat/`: New feature (e.g., `feat/delay-detection`)
- `fix/`: Bug fix (e.g., `fix/sse-connection-drop`)
- `docs/`: Documentation updates (e.g., `docs/api-specs`)
- `chore/`: Maintenance, dependency updates (e.g., `chore/update-react`)
- `refactor/`: Code refactoring without behavioral changes

---

## Workflow

1. **Branch Creation**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/recovery-logic
   ```

2. **Commit Changes**:
   - Commits should be atomic and logical.
   - Use Conventional Commits format for clear history.
   ```bash
   git commit -m "feat: implement adaptive recovery logic engine"
   ```

3. **Merge to Main**:
   - For solo development/demo setup, changes can be merged locally and pushed.
   - For team environments, Push the branch and create a Pull Request (PR) to `main`.
   ```bash
   # Solo workflow
   git checkout main
   git merge feat/recovery-logic
   git push origin main
   ```

---

## Commit Message Convention
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

`<type>(<optional scope>): <description>`

**Examples:**
- `feat(api): add endpoint for triggering manual delays`
- `fix(ui): resolve overflow issue on timeline component`
- `docs: update deployment guide for Docker`
- `chore: update Spring Boot to 3.2.0`
