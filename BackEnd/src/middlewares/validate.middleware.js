export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (!result.success) {
        const errors = result.error.issues.map((err) => ({
            field: err.path.join('.').replace('body.', ''),
            message: err.message,
        }));
        return res.status(400).json({ status: 'error', errors });
    }

    req.body = result.data.body;

    next();
};
