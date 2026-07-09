"use client";

import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId =
  "BItYkPk89PsMvcF159h8DqWq5nWTtfkkAypFR8LLPwHO-jYJopp3r6VQfiQp2ZdX9Hl_0foorGDscjgWhxGVKYs"; // get from https://dashboard.web3auth.io

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
};

export default web3AuthContextConfig;
