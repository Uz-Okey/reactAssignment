import { useState, useEffect, useRef } from 'react';
import {
  DataTable,
  type DataTableSelectionMultipleChangeEvent,
  type DataTablePageEvent,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import './App.css';
import { CustomerService } from './service/CustomerService';
import type { Customer } from './types/Customer';

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [rowCount, setRowCount] = useState<number | null>(1);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const op = useRef<OverlayPanel | null>(null);

  async function loadData(currentPage: number) {
    setLoading(true);
    const data = await CustomerService.getCustomersMedium(currentPage);
    setCustomers(data);
    setTotalRecords(1000);
    setLoading(false);
  }

  useEffect(() => {
    loadData(page);
  }, [page]);

  async function handleSelect() {
    if (!rowCount || rowCount <= 0) return;
    setLoading(true);

    const newSelectedIds = new Set(selectedRowIds);
    let currentPage = page;
    let selectedCount = newSelectedIds.size;

    while (selectedCount < rowCount && currentPage <= Math.ceil(totalRecords / 12)) {
      const data = await CustomerService.getCustomersMedium(currentPage);
      for (const item of data) {
        if (!newSelectedIds.has(item.id)) {
          newSelectedIds.add(item.id);
          selectedCount++;
        }
        if (selectedCount >= rowCount) break;
      }
      currentPage++;
    }

    setSelectedRowIds(newSelectedIds);
    setLoading(false);
    op.current?.hide();
  }

  function onPageChange(e: DataTablePageEvent) {
    if (e.page !== undefined) setPage(e.page + 1);
  }

  function handleSelectionChange(e: DataTableSelectionMultipleChangeEvent<Customer[]>) {
    const newSelectedIds = new Set(selectedRowIds);
    customers.forEach((c) => newSelectedIds.delete(c.id));
    e.value.forEach((c) => newSelectedIds.add(c.id));
    setSelectedRowIds(newSelectedIds);
  }

  const selectedProducts = customers.filter((c) => selectedRowIds.has(c.id));

  const selectHeader = (
    <div className="flex align-items-center justify-content-center">
      <Button
        type="button"
        icon="pi pi-check"
        className="icon"
        onClick={(e) => op.current?.toggle(e)}
      />
      <OverlayPanel ref={op}>
        <div className="flex flex-column gap-3 w-[200px] p-3">
          <span>Enter number of rows:</span>
          <InputNumber
            value={rowCount ?? undefined}
            onValueChange={(e) => setRowCount(e.value ?? null)}
            placeholder="Select rows..."
            min={1}
            max={100}
            showButtons
            className="showbutton"
            disabled={loading}
          />
          <Button
            label="Submit"
            icon="pi pi-check"
            onClick={handleSelect}
            disabled={!rowCount || loading}
            className="submitButton"
          />
        </div>
      </OverlayPanel>
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={customers}
        dataKey="id"
        selectionMode="multiple"
        selection={selectedProducts}
        onSelectionChange={handleSelectionChange}
        paginator
        lazy
        totalRecords={totalRecords}
        rows={12}
        onPage={onPageChange}
        tableStyle={{ minWidth: '60rem' }}
        className="custom-table"
        loading={loading}
        loadingIcon="pi pi-spinner pi-spin"
      >
        <Column selectionMode="multiple" className="row-color" headerStyle={{ width: '3rem' }} />
        <Column header={selectHeader} className="row-color" style={{ width: '10%' }} />
        <Column field="title" header="Title" className="row-color" style={{ width: '20%' }} />
        <Column field="place_of_origin" header="Place" className="row-color" style={{ width: '20%' }} />
        <Column field="artist_display" header="Artist" className="row-color" style={{ width: '20%' }} />
        <Column field="inscriptions" header="Inscriptions" className="row-color" style={{ width: '20%' }} />
      </DataTable>
    </div>
  );
}
