import Table from './modules/table.js';
import Form from './modules/form.js';

const table = new Table('.table', ['.open-form']);
new Form(table);
