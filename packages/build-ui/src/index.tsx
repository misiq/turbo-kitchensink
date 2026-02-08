import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { execa } from "execa";

type BuildStatus = "pending" | "building" | "success" | "error";

interface AppStatus {
	name: string;
	status: BuildStatus;
	url?: string;
	duration?: number;
	error?: string;
}

const BuildUI = () => {
	const [apps, setApps] = useState<AppStatus[]>([
		{ name: "next-app", status: "pending" },
		{ name: "docs", status: "pending" },
		{ name: "@repo/ui", status: "pending" },
	]);

	useEffect(() => {
		buildApps();
	}, []);

	const buildApps = async () => {
		// Wywołaj turbo build i parsuj output
		try {
			const { stdout } = await execa("turbo", ["build", "--summarize"]);

			// Parsuj output Turborepo
			parseAndUpdateStatus(stdout);
		} catch (error) {
			console.error("Build failed:", error);
		}
	};

	const parseAndUpdateStatus = (output: string) => {
		// Tutaj parsujesz output z turbo
		// Aktualizujesz status każdej appki

		setApps((prev) =>
			prev.map((app) => ({
				...app,
				status: "success",
				url: getAppUrl(app.name),
				duration: Math.random() * 5000,
			})),
		);
	};

	const getAppUrl = (name: string): string => {
		const urls: Record<string, string> = {
			"next-app": "http://localhost:3000",
			docs: "http://localhost:3001",
		};
		return urls[name] || "";
	};

	const getStatusColor = (status: BuildStatus) => {
		switch (status) {
			case "pending":
				return "gray";
			case "building":
				return "yellow";
			case "success":
				return "green";
			case "error":
				return "red";
		}
	};

	const getStatusIcon = (status: BuildStatus) => {
		switch (status) {
			case "pending":
				return "⏳";
			case "building":
				return "🔨";
			case "success":
				return "✅";
			case "error":
				return "❌";
		}
	};

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text bold color="cyan">
					🚀 Turborepo Build Status
				</Text>
			</Box>

			{apps.map((app) => (
				<Box key={app.name} flexDirection="column" marginBottom={1}>
					<Box>
						<Text>{getStatusIcon(app.status)} </Text>
						<Text bold>{app.name}</Text>
						<Text color={getStatusColor(app.status)}> [{app.status}]</Text>
						{app.duration && (
							<Text dimColor> ({(app.duration / 1000).toFixed(2)}s)</Text>
						)}
					</Box>

					{app.url && app.status === "success" && (
						<Box marginLeft={3}>
							<Text color="blue">→ {app.url}</Text>
						</Box>
					)}

					{app.error && (
						<Box marginLeft={3}>
							<Text color="red">{app.error}</Text>
						</Box>
					)}
				</Box>
			))}

			<Box marginTop={1} borderStyle="single" borderColor="gray" padding={1}>
				<Text dimColor>Press Ctrl+C to exit</Text>
			</Box>
		</Box>
	);
};

export default BuildUI;
