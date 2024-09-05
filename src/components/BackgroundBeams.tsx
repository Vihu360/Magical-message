import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function BackgroundBeamsWithCollisionDemo() {
	return (
		<BackgroundBeamsWithCollision>
			<div className="text-center text-white relative z-20 pb-12">
				<h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-sans tracking-tight">
					Ready for the Ultimate Truth Bomb?
				</h2>
				<div className="relative mx-auto inline-block w-max mt-4 text-lg md:text-xl lg:text-2xl font-bold font-sans tracking-tight">
					<div className="absolute left-0 top-0 bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
						<span className="">Invite Your Friends Now!</span>
					</div>
					<div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
						<span className="">Invite Your Friends Now!</span>
					</div>
				</div>
			</div>
		</BackgroundBeamsWithCollision>
	);
}
