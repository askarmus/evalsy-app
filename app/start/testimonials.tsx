import React from 'react';

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'James Miller',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: 'Hiring has never been this smooth! With AI automation, we filled roles faster than ever. Truly effortless and efficient!',
    },
    {
      id: 2,
      name: 'Lucy Henderson',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      quote: 'I was blown away by how simple the hiring process became. The AI did the heavy lifting, letting me focus on choosing the best candidates.',
    },
    {
      id: 3,
      name: 'Michael Lee',
      image: 'https://randomuser.me/api/portraits/men/76.jpg',
      quote: 'From endless paperwork to streamlined hiring—this AI tool transformed our recruitment. Its like having an extra HR team!',
    },
    {
      id: 4,
      name: 'Sophia Turner',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      quote: 'Effortless is an understatement. The AI handled everything from screening to scheduling, saving us hours of manual work.',
    },
    {
      id: 5,
      name: 'David Nguyen',
      image: 'https://randomuser.me/api/portraits/men/84.jpg',
      quote: 'What used to take weeks now takes days. The AI makes hiring so simple that I wonder how we ever managed without it.',
    },
    {
      id: 6,
      name: 'Emily Clark',
      image: 'https://randomuser.me/api/portraits/women/67.jpg',
      quote: "This tool turned hiring chaos into clarity. With AI automation, we found top talent without breaking a sweat! It's a complete game-changer for our team.",
    },
  ];

  // Split testimonials into groups of 2 for each column
  const columns = [
    [testimonials[0], testimonials[1]],
    [testimonials[2], testimonials[3]],
    [testimonials[4], testimonials[5]],
  ];

  return (
    <section id="testimonials" aria-labelledby="faq-title" className="relative overflow-hidden bg-darkbase py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 id="faq-title" className="font-display text-4xl font-bold text-white sm:text-4xl">
            What people are saying about us.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">If you cant find what you are looking for, email our support team and if you are lucky someone will get back to you.</p>
        </div>
        <div className="flex flex-wrap -m-4 mt-8">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="w-full p-4 md:w-1/3">
              {column.map((testimonial) => (
                <div key={testimonial.id} className="p-6   bg-darkbase-sec shadow-xl rounded-3xl mb-4">
                  <a className="inline-flex items-center mb-2">
                    <img alt="blog" src={testimonial.image} className="flex-shrink-0 object-cover object-center w-8 h-8 rounded-full" />
                    <span className="flex flex-col flex-grow pl-4">
                      <span className="text-xs uppercase text-slate-100">{testimonial.name}</span>
                    </span>
                  </a>
                  <p className="text-sm leading-relaxed text-white">{`"${testimonial.quote}"`}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
