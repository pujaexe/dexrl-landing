"use client";

const noResults = "/icons/no-result.svg";

const EmptySearchResult = () => {
    return (
        <div className="px-4 mt-3 flex justify-center items-center flex-col gap-2 text-center flex-1">
            <img src={noResults} alt="no results" className="w-10 h-10" />
            <p className="text-sm text-[#6A9080]">
                No results found for this token. <br />
                Please search by contract address <br />
                or try selecting a different chain.
            </p>
        </div>
    );
};

export default EmptySearchResult;