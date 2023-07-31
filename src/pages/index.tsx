import { useEffect, useState } from "react";
import { DAppRegistryApi, Dapp } from "@merokudao/storekit-sdk";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  // State to store the list of dApps
  const [dapps, setDapps] = useState<Dapp[]>();
  // Loading state when fetching the list of dApps
  const [loadingDapps, setLoadingDapps] = useState<boolean>(true);

  // Pagination
  const resultsPerPage = 15;
  const [page, setPage] = useState<number | undefined>(1);
  const [numPages, setNumPages] = useState<number>();

  // useEffect to fetch the list of dApps and store them in the state
  useEffect(() => {
    (async () => {
      setLoadingDapps(true);
      // Base URL for the mainnet API
      const baseURL = "https://api-a.meroku.store";

      // Instantiate the dApp Registry API
      const dAppRegistryAPI = new DAppRegistryApi({
        basePath: baseURL,
      });

      // Get the dApps list, and store it in the state
      const dAppsRequest = await dAppRegistryAPI.getDAppV1(
        page, // page
        resultsPerPage, // limit
        undefined, // search term
        true, // is dapp listed
        137, // Polygon chain ID
        undefined, // language
        undefined, // availableOnPlatform
        undefined, // matureForAudience
        undefined, // minAge
        undefined, // listedOnOrAfter
        undefined, // listedOnOrBefore
        undefined, // allowedInCountries
        undefined, // blockedInCountries
        [["games"]] // categories
      );
      const newlyLoadedDapps = dAppsRequest.data.response;

      setDapps([...(dapps || []), ...(newlyLoadedDapps || [])]);
      setNumPages(dAppsRequest.data.pageCount);
      setLoadingDapps(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Iterate over the list of dApps and render them
  return (
    <main className="container flex flex-col align-middle w-full min-h-screen py-2 pt-20">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col items-start justify-start">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            dApp Store Kit Demo
          </h1>
          <p className="text-sm text-muted-foreground mt-4">
            Browse featured decentralized applications available on the store.
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-start flex-wrap w-full mt-8 gap-8">
        {dapps?.map((dapp) => (
          <Link
            href={`/dapps/${dapp.dappId}`}
            className="flex flex-col items-start justify-start w-full sm:w-56 h-56 rounded-xl overflow-hidden border border-solid border-opacity-10 transition-all duration-200 transform hover:scale-105 hover:bg-accent hover:border-primary-foreground cursor-pointer p-2 pb-3 hover:shadow-lg"
            key={dapp.dappId}
          >
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={dapp.images?.logo?.toString() || ""}
              alt={dapp.name}
              className="relative top-2 left-2 w-12 h-12 rounded-full"
            />
            <div className="flex flex-col items-start justify-end w-full h-full p-2">
              <h2 className="text-xl font-bold">{dapp.name}</h2>
              <p className="text-sm text-muted-foreground mt-4 overflow-ellipsis max-h-16 ">
                {dapp.description}
              </p>
            </div>
          </Link>
        ))}

        {loadingDapps &&
          Array.from(Array(resultsPerPage).keys()).map((i) => (
            <Skeleton
              key={i}
              className="flex flex-col items-start justify-start w-full sm:w-56 h-56 rounded-xl overflow-hidden border border-solid border-opacity-10 p-2 pb-3"
            />
          ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-row items-center justify-center w-full mt-8">
        {page && numPages && page < numPages && (
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            Load More
          </Button>
        )}
      </div>
    </main>
  );
}
