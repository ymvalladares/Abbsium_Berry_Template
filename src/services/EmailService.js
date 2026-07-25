import emailjs from '@emailjs/browser';

export const sendContactEmail = async ({ name, email, budget, message }) => {
  const templateParams = {
    from_name: name,
    from_email: email,
    budget: budget || 'Not specified',
    message: message,
    reply_to: email
  };

  const response = await emailjs.send('service_a7w8vkh', 'template_1to3q3d', templateParams, '_E9TACxOeItnE-fsw');

  if (response.status !== 200) {
    throw new Error('EmailJS failed with status: ' + response.status);
  }

  return response;
};
