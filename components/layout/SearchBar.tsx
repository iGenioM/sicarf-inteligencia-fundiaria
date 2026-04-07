import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="mb-5 flex items-center justify-between rounded-md border border-sicarf-gray-200 bg-white px-4 py-2.5">
      <div className="flex flex-1 items-center gap-2.5">
        <input
          type="search"
          placeholder="Informe o nome do servidor, processo ou município"
          className="flex-1 border-0 bg-transparent text-[13px] text-sicarf-gray-700 outline-none placeholder:text-sicarf-gray-400"
        />
        <Search
          className="size-4 shrink-0 text-sicarf-gray-400"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <div className="ml-5 flex gap-4">
        <button
          type="button"
          className="cursor-pointer text-[13px] font-medium text-sicarf-green"
        >
          Pesquisa avançada
        </button>
        <button
          type="button"
          className="cursor-pointer text-[13px] font-medium text-sicarf-green"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
