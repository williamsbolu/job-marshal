interface iAppProps {
  days: number;
  price: number;
  description: string;
}

export const jobListingDurationPricing: iAppProps[] = [
  {
    days: 7,
    price: 10,
    description: "Standard listing",
  },
  {
    days: 14,
    price: 20,
    description: "Extended visibility",
  },
  {
    days: 30,
    price: 25,
    description: "Extended visibility",
  },
];
