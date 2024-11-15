import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PricingCard = ({
  title,
  price,
  features,
  recommended = false,
}: {
  title: string;
  price: number;
  features: string[];
  recommended?: boolean;
}) => {
  return (
    <Card className={`relative ${recommended ? "border-primary" : ""}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
          Recommended
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-3xl font-bold">
          ${price}
          <span className="text-sm font-normal text-muted-foreground">
            /month
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
