export default function HomePage(props: { children: React.ReactNode }) {
    return (
        <div
            className="flex min-h-screen w-full flex-col items-center justify-center p-4 text-white"
            style={{
                background:
                    "radial-gradient(farthest-corner circle at 50% 50% in oklch, rgba(0, 0, 0, 0.76) 0%, oklch(0% 0.30 200) 62% 62%)",
            }}
        >
            <main className="text-center">{props.children}</main>
        </div>
    );
}
