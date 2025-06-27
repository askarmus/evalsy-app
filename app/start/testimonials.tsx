import React from 'react';

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: 'Hiring has never been this smooth! With AI automation, we now find top talent faster than ever. Truly effortless and efficient.',
      name: 'Jessica Moore',
      jobTitle: 'Head of Talent, New York',

      image: '/images/testimonials/jessica-moore.jpg',
    },
    {
      id: 2,
      quote: 'From pipeline to onboarding, the trend in our hiring success has skyrocketed, especially when paired with Evalsy’s AI Interviewer.',
      name: 'Cheryl Tan',
      jobTitle: 'HR Manager',
      image: '/images/testimonials/cheryl-tan.jpg',
    },
    {
      id: 3,
      quote: 'We used to waste weeks screening resumes. The AI makes hiring so much faster I wonder how we worked without it.',
      name: 'Naveen Rajapaksa',
      jobTitle: 'Recruitment Director',
      image: '/images/testimonials/naveen-rajapaksa.jpg',
    },
    {
      id: 4,
      quote: 'I was blown away by how simple the hiring process became. The AI did the heavy lifting, letting me focus on choosing the best candidates.',
      name: 'Mei Ling Ong',
      jobTitle: 'Hiring Lead',
      image: '/images/testimonials/mei-ling-ong.jpg',
    },
    {
      id: 5,
      quote: 'Evalsy is an AI game-changer. The AI handled everything from screening to scheduling, saving us hours of manual work.',
      name: 'Brandon Scott',
      jobTitle: 'HR Operations',
      image: '/images/testimonials/brandon-scott.jpg',
    },
    {
      id: 6,
      quote: 'This tool transformed how we hire entire teams. With AI automation, we found top talent without breaking a sweat. It’s a complete game changer for our team.',
      name: 'Siti Nurhaliza',
      jobTitle: 'Talent Ops',
      image: '/images/testimonials/siti-nurhaliza.jpg',
    },
  ];

  // Split testimonials into groups of 2 for each column
  const columns = [
    [testimonials[0], testimonials[1]],
    [testimonials[2], testimonials[3]],
    [testimonials[4], testimonials[5]],
  ];

  return (
    <section id="testimonials" aria-labelledby="faq-title" className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-3xl lg:mx-0">
          <h2 id="faq-title" className="font-display text-4xl font-semibold  sm:text-4xl text-[#262626]">
            What people are saying about us.
          </h2>
          <p className="mt-4 text-lg tracking-tight ">If you cant find what you are looking for, email our support team and if you are lucky someone will get back to you.</p>
        </div>
        <div className="flex flex-wrap -m-4 mt-8">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="w-full p-4 md:w-1/3">
              {column.map((testimonial) => (
                <div key={testimonial.id} className="p-6  shadow-2xl rounded-2xl bg-white mb-4">
                  <a className="inline-flex items-center mb-2">
                    <img alt="blog" src={testimonial.image} className="flex-shrink-0 object-cover object-center w-8 h-8 rounded-full" />
                    <span className="flex flex-col flex-grow pl-4">
                      <span className="text-sm font-semibold    ">{testimonial.name}</span>
                      <span className="text-xs    ">{testimonial.jobTitle}</span>
                    </span>
                  </a>
                  <p className="text-sm leading-relaxed ">{`"${testimonial.quote}"`}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
