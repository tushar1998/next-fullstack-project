import { Column, Img, Link, Row, Section, Text } from "@react-email/components";
import React from "react";

interface FooterProps {
  email?: string;
}

const Footer = ({ email }: FooterProps) => {
  return (
    <Section className="max-w-[576px] m-0 px-6 py-8">
      <Text className="m-0 text-sm pb-4 text-slate-500 text-balance">
        This email was sent to{" "}
        <Link className="text-bold underline cursor-pointer">
          {email ?? "johndoe@untitledui.com"}
        </Link>
        . If you&#39;d rather not receive this kind of email, you can{" "}
        <Link className="text-bold underline cursor-pointer">unsubscribe</Link> or
        <Link className="text-bold underline cursor-pointer"> manage your email preferences.</Link>
      </Text>

      <Text className="m-0 text-sm text-slate-500 pb-12">
        © 2077 Untitled UI, 100 Smith Street, Melbourne VIC 3000
      </Text>

      <Row>
        <Column>
          <Img
            src="https://res.cloudinary.com/dq8ftemg9/image/upload/v1705397852/logo-no-back2_d3zaoi.png"
            height="24"
          />
        </Column>
        <Column>
          <ul className="text-right">
            <li className="inline-block m-0 mr-2">
              <Link href="https://instagram.com/2shar_mistry">
                <Img
                  src="https://res.cloudinary.com/dq8ftemg9/image/upload/v1705400678/instagram_bulevq.png"
                  width="20"
                  height="20"
                />
              </Link>
            </li>
            <li className="inline-block m-0 mr-2 ">
              <Link href="https://github.com/tushar1998">
                <Img
                  src="https://res.cloudinary.com/dq8ftemg9/image/upload/v1705405129/instagram_new_converted_c1xw1m.png"
                  width="20"
                  height="20"
                />
              </Link>
            </li>
            <li className="inline-block m-0">
              <Link href="https://x.com/Tushar98Mistry">
                <Img
                  src="https://res.cloudinary.com/dq8ftemg9/image/upload/v1705411394/twitter_fgbcaf.png"
                  width="20"
                  height="20"
                />
              </Link>
            </li>
          </ul>
        </Column>
      </Row>
    </Section>
  );
};

export default Footer;
