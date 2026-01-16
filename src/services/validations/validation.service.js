class Validation {
  stack = [];

  error = null;

  use(middleware) {
    this.stack.push(middleware);
  }

  execute = async (conf, query) => {
    let prevIndex = -1;

    const runner = async (index) => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times');
      }
      prevIndex = index;

      const middleware = this.stack[index];

      if (middleware) {
        await middleware(
          (error = null) => {
            this.error = null;
            if (error) {
              this.error = new Error(error);
              throw this.error;
            }
            const next = runner(index + 1);
            return next;
          },
          conf,
          query
        );
      }
    };

    await runner(0);
    return this.error;
  };
}

module.exports = Validation;
