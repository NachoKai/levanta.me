import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { MdWorkOutline } from "react-icons/md";
import { describe, expect, it } from "vitest";
import { StatusItem } from "../../src/components/StatusSection/StatusItem";

describe("StatusItem", () => {
  const mockLabel = "Test Label";
  const mockValue = "Test Value";
  const mockIcon = MdWorkOutline;
  const mockColor = "green.500";

  it("renders the StatusItem component with correct label and value", () => {
    render(
      <ChakraProvider>
        <StatusItem
          color={mockColor}
          icon={mockIcon}
          label={mockLabel}
          value={mockValue}
        />
      </ChakraProvider>
    );

    const labelElement = screen.getByText(mockLabel);

    expect(labelElement).toBeInTheDocument();

    const valueElement = screen.getByText(mockValue);

    expect(valueElement).toBeInTheDocument();
  });
});
