import React from 'react';

export function Table({ children }) {
  return <table className="w-full border-collapse">{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableHead({ children }) {
  return <th className="border px-4 py-2 text-right">{children}</th>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}

export function TableCell({ children }) {
  return <td className="border px-4 py-2 text-right">{children}</td>;
}