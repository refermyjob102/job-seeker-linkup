
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  actionRoute?: string;
}

const EmptyState = ({ message, actionLabel, actionRoute }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground">{message}</p>
        {actionLabel && actionRoute && (
          <Button 
            className="mt-4" 
            onClick={() => navigate(actionRoute)}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
