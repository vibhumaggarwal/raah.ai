"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Waitlist() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setErrorMessage("Please enter an email address");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to join waitlist");
            }

            setStatus("success");
            setEmail("");
            
        } catch (error: any) {
            console.error("Waitlist error:", error);
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center p-8 rounded-2xl bg-white/5 border border-black/5 shadow-2xl backdrop-blur-xl"
                    >
                        <motion.h3 
                            className="text-xl md:text-2xl text-gray-900 mb-2"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            welcome, you're a part of the journey now
                        </motion.h3>
                        <motion.p 
                            className="text-gray-500 text-sm italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            soon you...
                        </motion.p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
                                Join the Waitlist
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base max-w-sm mx-auto">
                                Be the first to experience the world narrated as you move through it.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-sm mx-auto group">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full transition-opacity opacity-0 group-hover:opacity-100 duration-500 pointer-events-none" />
                            
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === "error") setStatus("idle");
                                }}
                                disabled={status === "loading"}
                                className="pr-28 h-14 bg-white/50 backdrop-blur-sm border-gray-200/50 hover:border-gray-300 focus:border-gray-900 transition-colors shadow-sm rounded-full text-base px-6 placeholder:text-gray-400"
                            />
                            
                            <Button 
                                type="submit" 
                                disabled={status === "loading"}
                                className="absolute right-1.5 top-1.5 bottom-1.5 h-auto rounded-full px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-transform hover:scale-105 active:scale-95"
                            >
                                {status === "loading" ? "Joining..." : "Join"}
                            </Button>
                        </form>
                        
                        <AnimatePresence>
                            {status === "error" && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-red-500 text-sm text-center mt-3"
                                >
                                    {errorMessage}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
