import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '8657664599';
  const message = "Hello! I'd like to inquire about Meena Eyecare products.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.505 1.905 6.344l-1.225 4.485 4.635-1.218zM8.332 9.55c-.27-.27-.59-.419-.92-.42a1.43 1.43 0 00-1.03 1.045s-.19 1.578.58 2.868c.77 1.29 2.22 3.18 4.29 3.996.5.2 1 .3 1.4.3.8 0 1.2-.5 1.4-.8.2-.3.2-.7.1-1l-.3-1c-.1-.3-.2-.4-.4-.5-.2-.1-.4-.1-.6-.1s-.4.1-.6.2c-.2.2-.3.4-.5.6-.2.2-.4.3-.6.2s-1.1-.4-2.1-1.2c-.8-.7-1.4-1.5-1.5-1.8-.1-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.2-.3.3-.4.1-.1.1-.3 0-.4z" />
      </svg>
    </a>
  );
};
