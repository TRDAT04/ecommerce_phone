import { Info } from "lucide-react";

export default function ProductSpecs({ specs = [] }) {
  if (!specs.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-2">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Thông số kỹ thuật</h2>
      </div>

      <table className="w-full text-[15px] ">
        <tbody>
          {specs.map((s, i) => (
            <tr
              key={i}
              className="rounded-lg hover:bg-gray-100 transition"
            >
              <td className="py-3 px-3 font-medium text-gray-800 bg-gray-50 rounded-l-lg w-1/3 border border-gray-200">
                {s.specName}
              </td>

              <td className="py-3 px-3 text-gray-700 bg-white rounded-r-lg border border-gray-200 whitespace-pre-line">
                {s.specValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}