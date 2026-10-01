"use client";

import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronDown,
  CircleHelp,
  Folder,
  GitBranch,
  GitCommitHorizontal,
  Layers,
  Plus,
  Settings,
  Terminal,
  Timer,
  Webhook,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import styles from "./local-dashboard-overview.module.css";

const dashboardWidth = 1272;

const runs = [
  {
    additions: "+312",
    branch: "perf/image-upload-optimization",
    commit: "ab72fe91",
    deletions: "-22",
    duration: "1h",
    group: "Ready for review",
    groupColor: "#3b82f6",
    name: "optimize-image-upload-pipeline",
    service: "frontend-service",
    variant: "review",
  },
  {
    additions: "+11",
    branch: "feature/auth-validation-rules",
    commit: "f4f24666",
    deletions: "-0",
    duration: "6m",
    group: "Running",
    groupColor: "#10b981",
    name: "auth-form-validation-fix",
    service: "backend-service",
    variant: "running",
  },
  {
    additions: "+291",
    branch: "refactor/api-error-handling",
    commit: "c91ab42e",
    deletions: "-125",
    duration: "15m",
    group: "Waiting approval",
    groupColor: "#eab308",
    name: "refactor-api-error-handling",
    service: "backend-service",
    variant: "approval",
  },
  {
    additions: "+26",
    branch: "fix/inventory-sync-race",
    commit: "9d2e7ac1",
    deletions: "-211",
    duration: "9m",
    group: "Error",
    groupColor: "#ef4444",
    name: "fix-inventory-sync-race-condition",
    service: "inventory-service",
    variant: "error",
  },
] as const;

const sidebarItems = [
  ["Monitor", ChartNoAxesColumn],
  ["Logs", Terminal],
  ["Webhooks", Webhook],
] as const;

const footerItems = [
  ["Invite member", Plus],
  ["Settings", Settings],
  ["Docs", BookOpen],
] as const;

function DashboardPill({
  children,
  icon,
}: {
  children: string;
  icon: ReactNode;
}) {
  return (
    <span className={styles.localDashboardPill}>
      {icon}
      <span>{children}</span>
    </span>
  );
}

export function LocalDashboardOverview() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const updateScale = () => {
      stage.style.setProperty(
        "--local-dashboard-scale",
        String(stage.clientWidth / dashboardWidth),
      );
    };
    const resizeObserver = new ResizeObserver(updateScale);

    updateScale();
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={styles.localDashboardStage}
      data-debug-media
    >
      <div className={styles.localDashboard}>
        <aside className={styles.localDashboardSidebar}>
          <header className={styles.localDashboardProject}>
            <span className={styles.localDashboardProjectMark}>A</span>
            <span>Acme.inc</span>
            <ChevronDown aria-hidden="true" size={16} strokeWidth={1.8} />
          </header>

          <nav className={styles.localDashboardNavigation}>
            <section>
              <p className={styles.localDashboardSectionLabel}>Runs</p>
              <button
                className={`${styles.localDashboardNavItem} ${styles.localDashboardNavItemActive}`}
                type="button"
              >
                <Layers aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>All runs</span>
              </button>
              <div className={styles.localDashboardRunNavigation}>
                {runs.map((run) => (
                  <button
                    className={styles.localDashboardNavItem}
                    key={run.name}
                    type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={styles.localDashboardStatusDot}
                        style={{ background: run.groupColor }}
                      />
                      <span>{run.name}</span>
                    </button>
                ))}
              </div>
            </section>

            <section>
              <p className={styles.localDashboardSectionLabel}>Tools</p>
              {sidebarItems.map(([label, Icon]) => (
                <button
                  className={styles.localDashboardNavItem}
                  key={label}
                  type="button"
                >
                  <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              ))}
            </section>
          </nav>

          <footer className={styles.localDashboardSidebarFooter}>
            {footerItems.map(([label, Icon]) => (
              <button
                className={styles.localDashboardNavItem}
                key={label}
                type="button"
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </footer>
        </aside>

        <main className={styles.localDashboardMain}>
          <section className={styles.localDashboardPanel}>
            <header className={styles.localDashboardHeader}>
              <span className={styles.localDashboardHeaderTitle}>
                <Layers aria-hidden="true" size={16} strokeWidth={1.8} />
                All runs
              </span>
              <button className={styles.localDashboardHelp} type="button">
                <CircleHelp aria-hidden="true" size={16} strokeWidth={1.8} />
                Help
              </button>
            </header>

            <div className={styles.localDashboardContent}>
              {runs.map((run) => (
                <section
                  className={styles.localDashboardGroup}
                  key={run.name}
                >
                  <div className={styles.localDashboardStatus}>
                    <span
                      className={styles.localDashboardStatusDot}
                      style={{ background: run.groupColor }}
                    />
                    {run.group}
                  </div>

                  <article className={styles.localDashboardTask}>
                    <div className={styles.localDashboardTaskMain}>
                      <div className={styles.localDashboardTaskInfo}>
                        <div className={styles.localDashboardTaskTitle}>
                          <span>{run.name}</span>
                        </div>
                        <div className={styles.localDashboardMeta}>
                          <DashboardPill
                            icon={
                              <Folder
                                aria-hidden="true"
                                size={14}
                                strokeWidth={1.8}
                              />
                            }
                          >
                            {run.service}
                          </DashboardPill>
                          <DashboardPill
                            icon={
                              <GitBranch
                                aria-hidden="true"
                                size={14}
                                strokeWidth={1.8}
                              />
                            }
                          >
                            {run.branch}
                          </DashboardPill>
                          <DashboardPill
                            icon={
                              <GitCommitHorizontal
                                aria-hidden="true"
                                size={14}
                                strokeWidth={1.8}
                              />
                            }
                          >
                            {run.commit}
                          </DashboardPill>
                          <DashboardPill
                            icon={
                              <Timer
                                aria-hidden="true"
                                size={14}
                                strokeWidth={1.8}
                              />
                            }
                          >
                            {run.duration}
                          </DashboardPill>
                          <span className={styles.localDashboardDiff}>
                            <span>{run.additions}</span>
                            <span>{run.deletions}</span>
                          </span>
                        </div>
                      </div>

                      {run.variant === "review" ? (
                        <div className={styles.localDashboardActions}>
                          <button type="button">See changes</button>
                          <button
                            className={styles.localDashboardPrimaryAction}
                            type="button"
                          >
                            Create PR
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {run.variant === "running" ? (
                      <div className={styles.localDashboardTaskDetail}>
                        <span className={styles.localDashboardShimmer}>
                          Editing validation rules in auth-service
                        </span>
                      </div>
                    ) : null}

                    {run.variant === "approval" ? (
                      <div className={styles.localDashboardTaskDetail}>
                        <span>
                          Approval required to retry build with increased timeout
                          after API timeout failure
                        </span>
                        <div className={styles.localDashboardActions}>
                          <button type="button">Deny</button>
                          <button
                            className={styles.localDashboardPrimaryAction}
                            type="button"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {run.variant === "error" ? (
                      <div className={styles.localDashboardTaskDetail}>
                        Build failed: API timeout
                      </div>
                    ) : null}
                  </article>
                </section>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
