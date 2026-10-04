import React, { useState } from "react";

export default function LoggedIn({
	user,
	onLogin,
	onSignup,
	onLogout,
}) {
	const [showProfile, setShowProfile] = useState(false);

	if (!user) {
		return (
			<div>
				<button type="button" onClick={onLogin}>Login</button>{" "}
				<button type="button" onClick={onSignup}>Sign up</button>
			</div>
		);
	}

	const name = user.name || user.displayName || "Your profile";
	const image = user.profilePicture || user.photoURL || user.avatar;

	return (
		<div style={{ position: "relative", display: "inline-block" }}>
			<button
				type="button"
				onClick={() => setShowProfile((visible) => !visible)}
				aria-label="Show profile information"
				aria-expanded={showProfile}
				style={{
					width: 44,
					height: 44,
					padding: 0,
					border: 0,
					borderRadius: "50%",
					overflow: "hidden",
					background: "#e5e7eb",
					cursor: "pointer",
				}}
			>
				{image ? (
					<img
						src={image}
						alt={`${name} profile`}
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
				) : (
					name.charAt(0).toUpperCase()
				)}
			</button>

			{showProfile && (
				<section
					aria-label="Profile information"
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						right: 0,
						zIndex: 1,
						minWidth: 200,
						padding: 16,
						background: "white",
						border: "1px solid #ddd",
						borderRadius: 8,
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
					}}
				>
					<strong>{name}</strong>
					{user.email && <div>{user.email}</div>}
					{user.phone && <div>{user.phone}</div>}
					{onLogout && (
						<button type="button" onClick={onLogout} style={{ marginTop: 12 }}>
							Log out
						</button>
					)}
				</section>
			)}
		</div>
	);
}
