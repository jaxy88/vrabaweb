"use client";

import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface SpinnerCustomProps {
  show: boolean;
}

const SpinnerCustom = ({ show }: SpinnerCustomProps) => {
  if (!show) return null;
  return <Spinner />;
};

export default SpinnerCustom;
