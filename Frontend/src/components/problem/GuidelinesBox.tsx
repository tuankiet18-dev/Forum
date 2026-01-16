import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";

export const GuidelinesBox: React.FC = () => {
  return (
    <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
      <div className="flex items-center gap-2 mb-4 text-blue-500">
        <InfoCircleOutlined />
        <span className="font-bold">Guidelines</span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
        <li>Write a clear and specific problem statement</li>
        <li>Use LaTeX for mathematical expressions: $x^2 + y^2 = z^2$</li>
        <li>Select appropriate level and difficulty</li>
        <li>Add relevant tags to help others find your problem</li>
        <li>Provide necessary context and constraints</li>
      </ul>

      <div className="mt-4 p-3 bg-background/50 rounded border border-border/50">
        <p className="text-xs font-semibold text-foreground mb-1">
          LaTeX Examples:
        </p>
        <code className="text-xs text-muted-foreground block">
          Inline: {"$x^2 + 5x + 6 = 0$"} <br />
          Display: {"$$\\int_0^\\infty e^{-x^2} dx$$"}
        </code>
      </div>
    </div>
  );
};
