// Generic owner-scoped CRUD: farmers see only their own records, admins see all.
const pick = (o, keys) => keys.reduce((a, k) => (o[k] !== undefined ? { ...a, [k]: o[k] } : a), {});
module.exports = (Model, fields, populate = '') => {
  const scope = req => (req.user.role === 'admin' ? {} : { owner: req.user.id });
  return {
    list: async (req, res) => res.json(await Model.find(scope(req)).populate(populate).sort('-createdAt')),
    create: async (req, res) => res.status(201).json(await Model.create({ ...pick(req.body, fields), owner: req.user.id })),
    update: async (req, res) => {
      const doc = await Model.findOneAndUpdate({ _id: req.params.id, ...scope(req) }, pick(req.body, fields), { new: true, runValidators: true });
      doc ? res.json(doc) : res.status(404).json({ message: 'Not found' });
    },
    remove: async (req, res) => {
      const doc = await Model.findOneAndDelete({ _id: req.params.id, ...scope(req) });
      doc ? res.json({ deleted: true }) : res.status(404).json({ message: 'Not found' });
    }
  };
};
