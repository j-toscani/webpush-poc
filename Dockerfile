FROM denoland/deno

WORKDIR /app

ADD . /app

RUN deno lint
RUN deno install && cd client && deno install --allow-scripts && deno task build && cd ../ 

CMD ["deno", "task", "start"]