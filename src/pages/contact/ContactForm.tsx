'use client';
import React from 'react';

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import FormItem from "@/shared/Input/FormItem";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/TextArea/TextArea";

const ContactForm = () => {
  return (
    <form className="w-full space-y-5 mt-5"
      action="https://formspree.io/f/mqabqqre"
      method="POST">
      
      <div className="grid gap-5 md:grid-cols-2 font-bold">
        <FormItem label="Nombre completo">
          <Input
            name="nombre"
            placeholder="Nombre completo"
            sizeClass="h-14 px-4 py-5"
            type="text"
            rounded="rounded-lg"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
        <FormItem label="Correo electrónico">
          <Input
            name="correo"
            placeholder="example@email.com"
            sizeClass="h-14 px-4 py-5"
            type="email"
            rounded="rounded-lg"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormItem label="Telefono">
          <Input
            name="telefono"
            placeholder="(123) 456-7890"
            sizeClass="h-14 px-4 py-5"
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            rounded="rounded-lg"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
            onInput={e => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/[^0-9]/g, '');
            }}
          />
        </FormItem>
        <FormItem label="Dirección de envío">
          <Input
            name="direccion"
            placeholder="Calle, número, colonia, ciudad"
            sizeClass="h-14 px-4 py-5"
            type="text"
            rounded="rounded-lg"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
      </div>
      <FormItem label="Message">
        <Textarea
          name="mensaje"
          placeholder="Enter your message here!"
          className="border border-neutral-300 bg-white p-4 placeholder:text-neutral-500 focus:border-primary"
          rows={6}
        />
      </FormItem>
      <ButtonPrimary className="self-center" sizeClass="py-4 px-6" type="submit">
        Submit
      </ButtonPrimary>
    </form>
  );
};

export default ContactForm;
