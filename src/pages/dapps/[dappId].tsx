import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DAppRegistryApi, Dapp } from "@merokudao/storekit-sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function DappPage() {
  // Get the dApp ID from the URL using Next router.
  const router = useRouter();
  const { dappId } = router.query;

  // Loading state when fetching the dApp
  const [loadingDapp, setLoadingDapp] = useState<boolean>(true);
  // Store the loaded dApp in the state
  const [dapp, setDapp] = useState<Dapp>();

  // useEffect to fetch the dApps and store it in the state
  useEffect(() => {
    (async () => {
      if (!dappId) return;

      // Base URL for the mainnet API
      const baseURL = "https://api-a.meroku.store";

      // Instantiate the dApp Registry API
      const dAppRegistryAPI = new DAppRegistryApi({
        basePath: baseURL,
      });

      // Get dApp info by ID
      const response = await dAppRegistryAPI.apiV1DappSearchDappIdGet(
        dappId as string
      );

      // Get the dApp out of the response
      const result = response?.data?.data?.[0];

      // Store the dApp in the state
      setLoadingDapp(false);
      setDapp(result);
    })();
  }, [dappId]);

  // Render dApp information
  return (
    <main className="container flex flex-col align-middle w-full min-h-screen py-2 pt-20">
      {loadingDapp && <Skeleton className="w-full h-96" />}

      {!loadingDapp && dapp && (
        <>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={dapp.images?.banner?.toString()}
            alt={dapp.name}
            className="w-full h-48 sm:h-72 object-cover rounded-lg mb-4"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-2 px-4">
            <div className="flex flex-col sm:flex-row items-center">
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={dapp.images?.logo?.toString()}
                alt={dapp.name}
                className="w-24 h-24 sm:w-44 sm:h-44 object-cover rounded-lg mr-4 -mt-20 sm:-mt-12"
              />
              <div className="flex flex-col mt-4">
                <p className="leading-7 mb-2">
                  Category: {dapp.category.toLocaleUpperCase()}
                </p>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {dapp?.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
                  {dapp?.description}
                </p>
              </div>
            </div>

            <Button
              className="w-full mt-4 sm:w-auto"
              role="link"
              onClick={() =>
                // open link in new tab
                window.open(dapp.appUrl, "_blank")
              }
            >
              Visit App ↗
            </Button>
          </div>
          <Separator className="mt-8" />

          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors mt-3">
            Screenshots
          </h2>

          {dapp.images?.screenshots?.length === 0 ||
          dapp.images?.screenshots?.[0].toString() ===
            "https://dgshe1iny46ip.cloudfront.net/screenshots.png" ? (
            <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
              No screenshots available.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-2 px-4">
              {dapp.images?.screenshots?.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot.toString()}
                  alt={dapp.name}
                  className="w-1/4 p-2"
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
