export default function HomePage(props: { children: React.ReactNode }) {
    return (
        <div
            className="flex min-h-screen w-full flex-col items-center justify-center p-4 text-white"
        >
            <main className="text-center">{props.children}</main>
        </div>
    );
}
