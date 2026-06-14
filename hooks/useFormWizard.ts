import { useState } from "react";
import type { FormData } from "../data/interface";

type WizardStep = 0 | 1 | 2; // Tambahkan lebih banyak step sesuai kebutuhan

export function useFormWizard() {
  const [step, setStep] = useState<WizardStep>(0);
  const [data, setData] = useState<FormData>({
    step1: {
      amount: 0,
      token: {
        name: "",
        network: "",
        coinKey: "",
      },
      payment: {
        name: "",
        color: "",
        bankFee: 0,
        method: "",
        type: "",
      },
      received: 0,
      usdtRate: 0,
    },
    step2: {
      createdAt: "",
      quote: {
        toAddress: "",
        amount: 0,
        transactionId: "",
        quoteParams: {
          fromChain: 0,
          fromToken: "",
          toChain: 0,
          toToken: "",
        },
      },
    },
  });

  const updateStepData = <T extends keyof FormData>(
    stepKey: T,
    newData: Partial<FormData[T]>
  ) => {
    setData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...newData,
      },
    }));
  };

  const next = () =>
    setStep((prev) => (prev <= 2 ? ((prev + 1) as WizardStep) : prev));
  const back = () =>
    setStep((prev) => (prev > 0 ? ((prev - 1) as WizardStep) : prev));

  return {
    step,
    data,
    updateStepData,
    next,
    back,
  };
}
