import React from "react";
import { contact as contactSection } from "@/data/content";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Heading from "@/shared/Heading/Heading";

import ContactForm from "./ContactForm";

const page = () => {
  return (
    <section>
      <div className="container">
        <div className="mb-32 mt-20">
          <Heading desc={contactSection.description} isMain isCenter>
            {contactSection.heading}
          </Heading>

          <div className="mx-auto max-w-3xl bg-[#eeeeee] p-5 md:p-10 rounded-2xl">
            <ContactForm />
          </div>
        </div>

        <div className="mb-32">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Follow us on Instagram</h2>
            <a
              href="https://www.instagram.com/fitmexstore_/?igsh=MXZlZHZ0Mzg5MXB1bg%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ButtonSecondary className="border-2 border-[#ef4343] text-[#ef4343] hover:scale-105 transition-transform mt-5">
                Visit
              </ButtonSecondary>
            </a>
          </div>

          {/* <div className="grid gap-5 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-5">
              {contactSection.instagramPhotos.slice(0, 4).map((photo) => (
                <div key={photo}>
                  <Image
                    src={photo}
                    alt="instagram photo"
                    className="h-full w-full object-cover object-center max-w-[150px] max-h-[250px] rounded"
                    width={1000}
                    height={1000}
                  />
                </div>
              ))}
            </div>
            <div>
              <Image
                src={pathOr("", ["instagramPhotos", 4], contactSection)}
                alt="instagram photo"
                className="h-full w-full object-cover object-center max-w-[400px] max-h-[400px] rounded mt-5 -ml-12"
                width={1000}
                height={1000}
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default page;
