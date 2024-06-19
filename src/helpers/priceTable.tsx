"use client";

import React, { useEffect } from "react";

export const StripePricingTable = () => {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, []);

    return React.createElement("stripe-pricing-table", {
        "pricing-table-id": "prctbl_1PMqbIImZQQ97Myla9b3BibC",
        "publishable-key":
            "pk_test_51PMnhVImZQQ97MylZxCIfDZDriIbuBrMIENzwebZ2CM4XNS860aq2SYskBIwoTe8A8bwnN0hw1Hy2UzhQQrD0fag00Wkbs7Gzj",
    });

};