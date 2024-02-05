import Image from "next/image";

const Loader = () => {
    return (<div className="flex flex-col items-center justify-center gap-y-4 h-full">
        <div className="w-10 h-10 relative animate-spin">
            <Image alt="logo" fill src="/logo.png" />
        </div>
        <p className="text-sm text-muted-foreground">
            Genius is thinking
        </p>
    </div>);
}

export default Loader;