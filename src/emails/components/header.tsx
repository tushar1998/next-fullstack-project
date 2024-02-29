import { Column, Img, Row, Section } from "@react-email/components";
import React from "react";

const Header = () => {
  return (
    <Section className="m-0 w-[576px] p-6">
      <Row>
        <Column>
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
