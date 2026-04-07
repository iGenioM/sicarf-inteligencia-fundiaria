"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cpfDigitsOnly, formatCpfMask, isCpfLengthValid } from "@/lib/cpf";

export function LoginForm() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleCpfChange(value: string) {
    setCpf(formatCpfMask(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const cpfNumeros = cpfDigitsOnly(cpf);
    if (cpfNumeros.length !== 11) {
      setError("Informe um CPF com 11 dígitos.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: cpfNumeros, senha }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-sicarf-gray-100 bg-white p-8 shadow-lg">
      <div className="mb-8 flex items-center justify-center gap-3">
        <Image
          src="/Logo.svg"
          alt=""
          width={300}
          height={300}
          className="shrink-0 object-cover"
          priority
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="cpf"
          inputMode="numeric"
          autoComplete="username"
          placeholder="000.000.000-00"
          maxLength={14}
          value={cpf}
          onChange={(e) => handleCpfChange(e.target.value)}
          aria-invalid={cpf.length > 0 && !isCpfLengthValid(cpf)}
          className="w-full rounded-md border border-sicarf-gray-200 px-3 py-2.5 text-sm text-sicarf-gray-800 outline-none placeholder:text-sicarf-gray-400 focus:border-sicarf-green focus:ring-1 focus:ring-sicarf-green"
        />
        <input
          type="password"
          name="senha"
          autoComplete="current-password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full rounded-md border border-sicarf-gray-200 px-3 py-2.5 text-sm text-sicarf-gray-800 outline-none placeholder:text-sicarf-gray-400 focus:border-sicarf-green focus:ring-1 focus:ring-sicarf-green"
        />

        {error && (
          <p className="text-center text-xs font-medium text-sicarf-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border border-sicarf-green-dark bg-sicarf-green py-2.5 text-sm font-bold text-white transition-colors hover:bg-sicarf-green-dark disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm font-medium">
        <Link
          href="#"
          className="text-sicarf-green hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Redefinir senha
        </Link>
        <Link
          href="#"
          className="text-sicarf-green hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
