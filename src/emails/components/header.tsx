import { Column, Img, Row, Section, Text } from "@react-email/components";
import { Hexagon } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <Section className="p-6 w-[576px] m-0">
      <Row>
        <Column className="">
          <Img
            src="https://res.cloudinary.com/dq8ftemg9/image/upload/v1705397852/logo-no-back2_d3zaoi.png"
            height="32"
          />
        </Column>
      </Row>
    </Section>
  );
};

export default Header;
