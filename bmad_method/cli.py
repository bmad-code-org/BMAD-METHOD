"""Command-line entry point for the ``bmad`` / ``bmad-method`` console scripts."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import __version__
from . import ide
from .installer import InstallConfig, install


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="bmad",
        description="BMAD Method - install BMAD skills, agents, and workflows into a project (no npm required).",
    )
    parser.add_argument("--version", action="version", version=f"bmad-method {__version__}")

    sub = parser.add_subparsers(dest="command", metavar="<command>")

    install_cmd = sub.add_parser(
        "install",
        help="Install BMAD modules and configure IDE/tool integrations.",
        description="Install BMAD modules and configure IDE/tool integrations.",
    )
    install_cmd.add_argument(
        "--directory",
        default=".",
        help="Installation directory (default: current directory).",
    )
    install_cmd.add_argument(
        "--modules",
        default="bmm",
        help='Comma-separated module IDs to install (default: "bmm"). "core" is always included.',
    )
    install_cmd.add_argument(
        "--tools",
        default="",
        help='Comma-separated tool/IDE IDs to configure (e.g. "claude-code"). Required for a fresh install.',
    )
    install_cmd.add_argument("--user-name", dest="user_name", default=None, help="Name for agents to use.")
    install_cmd.add_argument("--communication-language", dest="communication_language", default=None)
    install_cmd.add_argument("--document-output-language", dest="document_output_language", default=None)
    install_cmd.add_argument("--output-folder", dest="output_folder", default=None)
    install_cmd.add_argument(
        "-y", "--yes", action="store_true", help="Accept defaults and run non-interactively (required for this PoC)."
    )
    install_cmd.set_defaults(func=_cmd_install)

    list_cmd = sub.add_parser("list-tools", help="List supported tool/IDE IDs and exit.")
    list_cmd.set_defaults(func=_cmd_list_tools)

    return parser


def _cmd_list_tools(_args: argparse.Namespace) -> int:
    for tool in ide.known_tools():
        print(f"  {tool:<20} -> {ide.target_dir_for(tool)}")
    return 0


def _cmd_install(args: argparse.Namespace) -> int:
    tools = _split_csv(args.tools)
    if not args.yes:
        print(
            "This proof-of-concept installer is non-interactive only. Re-run with --yes.",
            file=sys.stderr,
        )
        return 2
    if not tools:
        print(
            "No --tools specified. Pass e.g. --tools claude-code (run 'bmad list-tools' for options).",
            file=sys.stderr,
        )
        return 2

    unknown = [t for t in tools if t not in ide.known_tools()]
    if unknown:
        print(
            f"Unknown tool(s): {', '.join(unknown)}. Run 'bmad list-tools' for valid IDs.",
            file=sys.stderr,
        )
        return 2

    config = InstallConfig(
        directory=Path(args.directory),
        modules=_split_csv(args.modules),
        tools=tools,
        user_name=args.user_name,
        communication_language=args.communication_language,
        document_output_language=args.document_output_language,
        output_folder=args.output_folder,
        yes=True,
    )

    result = install(config)

    print("")
    print("  BMAD is ready to use!")
    print(f"    Modules:  {', '.join(result.modules)}")
    print(f"    Installed to: {result.bmad_dir}")
    for tool, info in result.ide_results.items():
        print(f"    {tool}: {info['skills']} skills -> {info['target_dir']}")
    print("")
    print("    Launch your AI agent from your project folder and invoke the bmad-help skill.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    if not getattr(args, "command", None):
        parser.print_help()
        return 0
    return args.func(args)


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
