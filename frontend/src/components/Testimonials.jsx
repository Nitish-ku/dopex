import React from 'react';

const testimonials = [
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600',
    quote: '“dopeX helped me design a campaign 10x faster than usual. It’s like creative steroids.”',
    name: 'Ritika S.',
    role: 'Content Designer',
  },
  {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600',
    quote: '“Honestly shocked at how easy dopeX made it to write stuff that *actually* sounds good.”',
    name: 'Aarav K.',
    role: 'Freelance Creator',
  },
  {
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop',
    quote: '“The image generation tool blew my mind. I’m not going back to stock photos ever again.”',
    name: 'Maya J.',
    role: 'Startup Founder',
  },
];

const Testimonials = () => {
  return (
    <>
    <h1 className="text-center text-4xl font-bold text-gray-900">They Tried It. They Loved It.</h1>
<p className="text-center text-gray-500 mt-1">
  We didn’t bribe them. They just vibed with dopeX. Real words from real people.
</p>

    <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-12">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="max-w-80 bg-black text-white rounded-2xl">
          <div className="relative -mt-px overflow-hidden rounded-2xl">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="h-[270px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top"
            />
            <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
          </div>
          <div className="px-4 pb-4">
            <p className="font-medium border-b border-gray-600 pb-5">{testimonial.quote}</p>
            <p className="mt-4">— {testimonial.name}</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#E0724A] to-[#9938CA] text-transparent bg-clip-text">
              {testimonial.role}
            </p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Testimonials;
