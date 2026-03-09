"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
    const [step, setStep] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Данные формы
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");

    // Ошибки
    const [errorMsg, setErrorMsg] = useState<string>("");

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Базовый URL твоего бэкенда
    const API_BASE = "http://127.0.0.1:8000";

    // Настройки для всех запросов fetch
    const fetchOptions = (body: object) => ({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include" as const, // Важно для сессий/куков
    });

    // --- Логика шагов ---

    const handleStep1Submit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return setErrorMsg("To'g'ri email kiriting");
        if (password.length < 4) return setErrorMsg("Parol juda qisqa");
        setErrorMsg("");
        setStep(2);
    };

    const handleRegisterAPI = async () => {
        setIsLoading(true);
        setErrorMsg("");
        try {
            const response = await fetch(`${API_BASE}/api/register/`, fetchOptions({ email, password }));
            if (response.ok) {
                setStep(3);
            } else {
                const data = await response.json();
                setErrorMsg(data.error || "Ro'yxatdan o'tishda xatolik");
            }
        } catch (err) {
            setErrorMsg("Server bilan ulanish yo'q (CORS или Offline)");
        } finally {
            setIsLoading(false);
        }
    };

    // Шаг 3: Проверка OTP кода через бэкенд
    const handleVerifyAPI = async () => {
        const otpString = code.join("");
        if (otpString.length !== 6) {
            setErrorMsg("Iltimos, barcha 6 ta katakni to'ldiring");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        // ВАЖНО: Отправляем email, password и code (otp)
        const payload = {
            email: email,
            password: password, // Пароль берется из переменной состояния (Step 1)
            code: otpString     // Код из ячеек
        };

        try {
            const response = await fetch(`${API_BASE}/api/verify/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                // credentials: "include" теперь не обязателен, но можно оставить
            });

            const data = await response.json();

            if (response.ok) {
                // Если всё ок, сохраняем токены в браузере (опционально)
                if (data.access) {
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);
                }
                setStep(4); // Переходим к вводу Имени/Фамилии
            } else {
                // Показываем ошибку от сервера (например: "Noto'g'ri OTP")
                setErrorMsg(data.error || "Xatolik yuz berdi");
            }
        } catch (error) {
            setErrorMsg("Server bilan ulanishda xatolik.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Обработка ввода кода ---
    const handleCodeChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Анимации вариантов
    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
            <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-[460px] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">

                {/* Прогресс-бар */}
                <div className="flex justify-center gap-2 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ width: step >= i ? 40 : 10, backgroundColor: step >= i ? "#16a34a" : "#e2e8f0" }}
                            className="h-2 rounded-full transition-colors duration-300"
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: Email & Pass */}
                    {step === 1 && (
                        <motion.div key="s1" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-gray-800">Xush kelibsiz!</h2>
                                <p className="text-gray-500">Davom etish uchun ma'lumotlarni kiriting</p>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="email" placeholder="Email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                />
                                <input
                                    type="password" placeholder="Parol" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                />
                                {errorMsg && <p className="text-red-500 text-sm font-medium ml-2">{errorMsg}</p>}
                                <button onClick={handleStep1Submit} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95">
                                    Davom etish
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Confirm Email */}
                    {step === 2 && (
                        <motion.div key="s2" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6 text-center">
                            <h2 className="text-3xl font-black text-gray-800">Tasdiqlash</h2>
                            <p className="text-gray-500">Kod yuborilsinmi: <br/><span className="text-gray-800 font-bold">{email}</span></p>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl">Orqaga</button>
                                <button onClick={handleRegisterAPI} disabled={isLoading} className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 disabled:opacity-50">
                                    {isLoading ? "Yuborilmoqda..." : "Ha, yuborilsin"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: OTP Code */}
                    {step === 3 && (
                        <motion.div key="s3" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-gray-800">Kodni kiriting</h2>
                                <p className="text-gray-500 mt-2">6 xonali kodni kiriting</p>
                            </div>
                            <div className="flex justify-between gap-2">
                                {code.map((digit, i) => (
                                    <input
                                        key={i} ref={(el) => {inputRefs.current[i] = el}}
                                        type="text" maxLength={1} value={digit}
                                        onChange={(e) => handleCodeChange(e.target.value, i)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                        className="w-12 h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                                    />
                                ))}
                            </div>
                            {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}
                            <button onClick={handleVerifyAPI} disabled={isLoading} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 disabled:opacity-50">
                                {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: Personal Info */}
                    {step === 4 && (
                        <motion.div key="s4" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-gray-800">So'nggi qadam</h2>
                                <p className="text-gray-500 mt-2">Ism va familiyangizni kiriting</p>
                            </div>
                            <div className="space-y-4">
                                <input placeholder="Ism" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-green-100 outline-none transition-all" />
                                <input placeholder="Familiya" value={surname} onChange={(e) => setSurname(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-green-100 outline-none transition-all" />
                                <button className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg active:scale-95">Yakunlash</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}